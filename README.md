# Niigata Gourmet Location Sample

新潟駅周辺のグルメスポットを紹介するWebサイトのサンプルコードです。

## 機能

- 新潟駅周辺のグルメスポットを地図上に表示
- ピンをクリックすると、グルメの画像と詳細情報を表示
- 詳細情報からグルメスポットのWebサイトに遷移可能
- グルメスポットのカテゴリを絞り込んで表示可能

## 技術スタック

- フロントエンド: React, Leaflet (地図表示)
- バックエンド: PHP/Slim Framework
- データベース: Amazon DynamoDB
- デプロイ: AWS Lambda (コンテナイメージ), Lambda Web Adopter, Lambda Function URLs

## プロジェクト構成

```
niigata_gourmet_location_sample/
├── frontend/           # Reactフロントエンドコード
│   ├── public/         # 静的ファイル
│   └── src/            # ソースコード
│       ├── components/ # Reactコンポーネント
│       ├── hooks/      # カスタムフック
│       └── services/   # APIサービス
├── backend/            # PHP/Slimバックエンドコード
│   ├── public/         # 公開ディレクトリ
│   └── src/            # ソースコード
│       ├── controllers/# コントローラー
│       ├── models/     # モデル
│       └── routes/     # ルート定義
└── infrastructure/     # インフラストラクチャコード
```

## セットアップ方法

### フロントエンド

```bash
cd frontend
npm install
npm start
```

### バックエンド

```bash
cd backend
composer install
php -S localhost:8080 -t public
```

## デプロイ方法

AWS Lambda へのデプロイ手順は `infrastructure/README.md` を参照してください。
