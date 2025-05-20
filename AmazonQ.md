# 新潟グルメマップ - Amazon Q によるコード生成

このプロジェクトは、Amazon Q を使用して生成された新潟駅周辺のグルメスポットを紹介するWebサイトのサンプルコードです。

## プロジェクト概要

context.md の要件に基づいて、以下の機能を持つWebサイトを構築しました：

1. 新潟駅周辺のグルメスポットを地図上に表示
2. ピンをクリックすると、グルメの画像と詳細情報を表示
3. 詳細情報からグルメスポットのWebサイトに遷移可能

## 技術スタック

- フロントエンド: React, Leaflet (地図表示)
- バックエンド: PHP/Slim Framework
- データベース: Amazon DynamoDB
- デプロイ: AWS Lambda (コンテナイメージ), Lambda Web Adopter, Lambda Function URLs

## 実装の特徴

### フロントエンド

- React を使用したモダンなSPA実装
- Leaflet ライブラリによる地図表示
- レスポンシブデザインによるPC/モバイル対応
- カスタムフックによるAPI通信の分離

### バックエンド

- Slim Framework によるRESTful API実装
- DynamoDB との連携
- CORS対応によるクロスオリジンリクエスト許可

### インフラストラクチャ

- AWS Lambda コンテナイメージによるサーバーレスデプロイ
- Lambda Web Adopter によるHTTPリクエスト処理
- Lambda Function URLs によるエンドポイント公開

## 使用方法

1. バックエンドのセットアップ
   - `backend` ディレクトリで `composer install` を実行
   - `.env.example` をコピーして `.env` を作成し、AWS認証情報を設定
   - `php -S localhost:8080 -t public` でローカルサーバーを起動

2. フロントエンドのセットアップ
   - `frontend` ディレクトリで `npm install` を実行
   - `.env` ファイルを作成し、`REACT_APP_API_URL=http://localhost:8080/api` を設定
   - `npm start` でローカル開発サーバーを起動

3. AWS へのデプロイ
   - `infrastructure/README.md` の手順に従ってデプロイ

## 拡張アイデア

- ユーザー認証機能の追加
- お気に入り登録機能
- レビュー投稿機能
- カテゴリによるフィルタリング
- 現在地からの距離表示
