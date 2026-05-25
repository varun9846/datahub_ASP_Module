#!/bin/bash

URL="http://localhost:3010/api/vlan-sync"
LOG_FILE="/var/log/datahub_api/curl_vlan_sync.log"

curl -s -X POST "$URL" >> "$LOG_FILE" 2>&1
echo "---- $(date '+%Y-%m-%d %H:%M:%S') ----" >> "$LOG_FILE"