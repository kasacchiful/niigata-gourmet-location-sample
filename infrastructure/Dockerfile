FROM public.ecr.aws/docker/library/php:8.3-alpine

# 必要なパッケージのインストール
RUN apk add --no-cache \
    git \
    zip \
    unzip \
    curl

# Composerのインストール
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

## AWS Lambda Web Adapterのインストール
# ARG LAMBDA_WEB_ADAPTER_VERSION=0.9.1
# RUN curl -Lo /tmp/aws-lambda-adapter.zip "https://github.com/awslabs/aws-lambda-web-adapter/archive/refs/tags/v${LAMBDA_WEB_ADAPTER_VERSION}.zip" \
#     && unzip /tmp/aws-lambda-adapter.zip -d /opt \
#     && rm /tmp/aws-lambda-adapter.zip
COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.9.1 /lambda-adapter /opt/extensions/lambda-adapter

# PHP拡張機能のインストール
RUN docker-php-ext-install pdo pdo_mysql opcache

# アプリケーションディレクトリの作成
WORKDIR /var/task

# アプリケーションファイルのコピー
COPY backend/ .

# Composerの依存関係をインストール
RUN composer install --no-dev --optimize-autoloader

# 環境変数の設定
ENV PORT=8080
ENV LAMBDA_WEB_ADAPTER_PORT=8080

# Lambda Web Adapterを使用してPHPアプリケーションを実行
# SHELL ["/bin/bash", "-c"]
# ENTRYPOINT ["/opt/aws-lambda-adapter/"]
CMD ["php", "-S", "0.0.0.0:8080", "-t", "public/"]
