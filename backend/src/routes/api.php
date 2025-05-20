<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Routing\RouteCollectorProxy;
use App\Controllers\SpotController;

// APIルートの定義
$app->group('/api', function (RouteCollectorProxy $group) {
    // グルメスポット一覧を取得
    $group->get('/spots', function (Request $request, Response $response) {
        $controller = new SpotController($this->get('dynamodb'), $this->get('settings')['aws']['dynamodb']['table']);
        return $controller->getAllSpots($request, $response);
    });

    // 特定のグルメスポットを取得
    $group->get('/spots/{id}', function (Request $request, Response $response, array $args) {
        $controller = new SpotController($this->get('dynamodb'), $this->get('settings')['aws']['dynamodb']['table']);
        return $controller->getSpotById($request, $response, $args);
    });
});
