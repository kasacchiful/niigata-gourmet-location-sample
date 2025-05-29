#!/bin/bash

jsondata=`yq -o json ./data.yaml`
echo ${jsondata}

aws dynamodb execute-transaction \
  --transact-statements="file://./truncate_table.json"

aws dynamodb batch-write-item \
  --request-items="${jsondata}"
