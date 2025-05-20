<?php

namespace App\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Aws\DynamoDb\DynamoDbClient;
use Aws\DynamoDb\Marshaler;

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
     */
    public function getAllSpots(Request $request, Response $response): Response
    {
        try {
            $result = $this->dynamoDb->scan([
                'TableName' => $this->tableName
            ]);

            $spots = [];
            if (isset($result['Items']) && !empty($result['Items'])) {
                foreach ($result['Items'] as $item) {
                    $spots[] = $this->marshaler->unmarshalItem($item);
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

            $spot = $this->marshaler->unmarshalItem($result['Item']);
            $response->getBody()->write(json_encode($spot));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'error' => $e->getMessage()
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }
}
