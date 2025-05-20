# AWS Lambda へのデプロイ手順

このドキュメントでは、新潟グルメマップアプリケーションを AWS Lambda にデプロイする手順を説明します。

## 前提条件

- AWS CLI がインストールされていること
- AWS アカウントと適切な権限があること
- Docker がインストールされていること

## デプロイ手順

### 1. DynamoDB テーブルの作成

```bash
aws dynamodb create-table \
    --table-name niigata_gourmet_spots \
    --attribute-definitions AttributeName=id,AttributeType=S \
    --key-schema AttributeName=id,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --region ap-northeast-1
```

### 2. サンプルデータの挿入

```bash
aws dynamodb batch-write-item --request-items file://infrastructure/sample-data.json
```

### 3. Docker イメージのビルド

```bash
docker build --platform=linux/amd64 -t niigata-gourmet-api -f infrastructure/Dockerfile .
```

### 4. ECR リポジトリの作成

```bash
aws ecr create-repository --repository-name niigata-gourmet-api --region ap-northeast-1
```

### 5. ECR へのログイン

```bash
aws ecr get-login-password --region ap-northeast-1 | docker login --username AWS --password-stdin <AWS_ACCOUNT_ID>.dkr.ecr.ap-northeast-1.amazonaws.com
```

### 6. イメージのタグ付けとプッシュ

```bash
docker tag niigata-gourmet-api:latest <AWS_ACCOUNT_ID>.dkr.ecr.ap-northeast-1.amazonaws.com/niigata-gourmet-api:latest
docker push <AWS_ACCOUNT_ID>.dkr.ecr.ap-northeast-1.amazonaws.com/niigata-gourmet-api:latest
```

### IAM Roleの作成

```bash
aws iam create-role \
    --role-name niigata-gourmet-api-lambda-execution-role \
    --assume-role-policy-document \
    '{
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Principal": {
                    "Service": "lambda.amazonaws.com"
                },
                "Action": "sts:AssumeRole"
            }
        ]
    }'
```

```bash
aws iam attach-role-policy \
    --role-name niigata-gourmet-api-lambda-execution-role \
    --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
aws iam attach-role-policy \
    --role-name niigata-gourmet-api-lambda-execution-role \
    --policy-arn arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess
```

### 7. Lambda 関数の作成

```bash
aws lambda create-function \
    --function-name niigata-gourmet-api \
    --package-type Image \
    --code ImageUri=<AWS_ACCOUNT_ID>.dkr.ecr.ap-northeast-1.amazonaws.com/niigata-gourmet-api:latest \
    --role arn:aws:iam::<AWS_ACCOUNT_ID>:role/niigata-gourmet-api-lambda-execution-role \
    --environment "Variables={DYNAMODB_TABLE=niigata_gourmet_spots}" \
    --region ap-northeast-1
```

### 8. Lambda Function URL の設定

```bash
aws lambda create-function-url-config \
    --function-name niigata-gourmet-api \
    --auth-type NONE \
    --cors "AllowOrigins=['*']" \
    --region ap-northeast-1
```

### 9. フロントエンドのビルドと S3 へのデプロイ（オプション）

```bash
cd frontend
npm install
npm run build

# S3 バケットの作成
aws s3 mb s3://niigata-gourmet-map --region ap-northeast-1

# ビルドファイルのアップロード
aws s3 sync build/ s3://niigata-gourmet-map --acl public-read
```

### 10. CloudFront ディストリビューションの作成（オプション）

```bash
aws cloudfront create-distribution \
    --origin-domain-name niigata-gourmet-map.s3.ap-northeast-1.amazonaws.com \
    --default-root-object index.html
```

```bash
aws cloudfront create-origin-access-control \
    --origin-access-control-config Name="niigata-gourmet-map-oac",SigningProtocol=sigv4,SigningBehavior=always,OriginAccessControlOriginType=s3
```

## 環境変数の設定

Lambda 関数には以下の環境変数を設定してください：

- `DYNAMODB_TABLE`: DynamoDB テーブル名（例: niigata_gourmet_spots）
- `AWS_REGION`: AWS リージョン（例: ap-northeast-1）

## 注意事項

- 本番環境では、適切なセキュリティ設定（認証、暗号化など）を行ってください。
- Lambda Function URL は開発環境向けです。本番環境では API Gateway の使用を検討してください。
