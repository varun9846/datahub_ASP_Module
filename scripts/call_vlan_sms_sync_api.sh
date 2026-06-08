#!/bin/bash

URL="http://localhost:3010/api/vlan-sms-sync"
LOG_FILE="/var/log/datahub_api/curl_vlan_sms_sync.log"

curl -s -X POST "$URL" >> "$LOG_FILE" 2>&1
echo "---- $(date '+%Y-%m-%d %H:%M:%S') ----" >> "$LOG_FILE"


crontab -e
0 * * * * /data/scripts/call_vlan_sms_sync_api.sh