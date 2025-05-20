<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;
use DI\Container;

require __DIR__ . '/../vendor/autoload.php';

// 環境変数の読み込み
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->safeLoad();

// DIコンテナの設定
$container = new Container();
$container->set('settings', function () {
    return [
        'displayErrorDetails' => true,
        'aws' => [
            'region' => $_ENV['AWS_REGION'] ?? 'ap-northeast-1',
            'version' => 'latest',
            'credentials' => [
                'key' => $_ENV['AWS_ACCESS_KEY_ID'] ?? '',
                'secret' => $_ENV['AWS_SECRET_ACCESS_KEY'] ?? '',
            ],
            'dynamodb' => [
                'table' => $_ENV['DYNAMODB_TABLE'] ?? 'niigata_gourmet_spots',
            ],
        ],
    ];
});

// DynamoDBクライアントの設定
$container->set('dynamodb', function ($c) {
    $settings = $c->get('settings')['aws'];
    $sdk = new Aws\Sdk([
        'region' => $settings['region'],
        'version' => $settings['version'],
        // 'credentials' => $settings['credentials'],
    ]);

    return $sdk->createDynamoDb();
});

// Slimアプリケーションの作成
AppFactory::setContainer($container);
$app = AppFactory::create();

// CORSミドルウェア
$app->add(function (Request $request, $handler) {
    $response = $handler->handle($request);
    return $response
        // ->withHeader('Access-Control-Allow-Origin', '*')
        ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
        ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
});

// ルートの設定
require __DIR__ . '/../src/routes/api.php';

// アプリケーションの実行
$app->run();
