#!/bin/bash

aws dynamodb execute-transaction \
  --transact-statements="file://./truncate_table01.json"

jsondata=`yq -o json ./data01.yaml`
aws dynamodb batch-write-item \
  --request-items="${jsondata}"

aws dynamodb execute-transaction \
  --transact-statements="file://./truncate_table02.json"

jsondata=`yq -o json ./data02.yaml`
aws dynamodb batch-write-item \
  --request-items="${jsondata}"
