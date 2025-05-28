<?php

namespace App\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Aws\DynamoDb\DynamoDbClient;
use Aws\DynamoDb\Marshaler;
use App\Models\Spot;

class SpotController
{
    private $dynamoDb;
    private $tableName;
    private $marshaler;

    public function __construct(DynamoDbClient $dynamoDb, string $tableName)
    {
        $this->dynamoDb = $dynamoDb;
        $this->tableName = $tableName;
        $this->marshaler = new Marshaler();
    }

    /**
     * 全てのグルメスポットを取得
     * クエリパラメータ tags[] でフィルタリング可能
     */
    public function getAllSpots(Request $request, Response $response): Response
    {
        try {
            $queryParams = $request->getQueryParams();
            $filterTags = isset($queryParams['tags']) ? (array)$queryParams['tags'] : [];
            
            $result = $this->dynamoDb->scan([
                'TableName' => $this->tableName
            ]);

            $spots = [];
            if (isset($result['Items']) && !empty($result['Items'])) {
                foreach ($result['Items'] as $item) {
                    $data = $this->marshaler->unmarshalItem($item);
                    $spot = Spot::fromArray($data);
                    
                    // タグによるフィルタリング
                    if (empty($filterTags) || $spot->hasAnyTag($filterTags)) {
                        $spots[] = $spot->toArray();
                    }
                }
            }

            $response->getBody()->write(json_encode($spots));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'error' => $e->getMessage()
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * IDによるグルメスポットの取得
     */
    public function getSpotById(Request $request, Response $response, array $args): Response
    {
        try {
            $id = $args['id'];
            $result = $this->dynamoDb->getItem([
                'TableName' => $this->tableName,
                'Key' => $this->marshaler->marshalItem(['id' => $id])
            ]);

            if (!isset($result['Item'])) {
                $response->getBody()->write(json_encode([
                    'error' => 'Spot not found'
                ]));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            $data = $this->marshaler->unmarshalItem($result['Item']);
            $spot = Spot::fromArray($data);
            
            $response->getBody()->write(json_encode($spot->toArray()));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'error' => $e->getMessage()
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }
    
    /**
     * 利用可能なタグ一覧を取得
     */
    public function getAllTags(Request $request, Response $response): Response
    {
        try {
            $result = $this->dynamoDb->scan([
                'TableName' => $this->tableName
            ]);

            $allTags = [];
            if (isset($result['Items']) && !empty($result['Items'])) {
                foreach ($result['Items'] as $item) {
                    $data = $this->marshaler->unmarshalItem($item);
                    $spot = Spot::fromArray($data);
                    
                    // すべてのタグを収集
                    foreach ($spot->tags as $tag) {
                        if (!in_array($tag, $allTags)) {
                            $allTags[] = $tag;
                        }
                    }
                }
            }
            
            // タグをアルファベット順にソート
            sort($allTags);

            $response->getBody()->write(json_encode($allTags));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'error' => $e->getMessage()
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }
}
