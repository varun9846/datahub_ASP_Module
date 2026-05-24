#!/bin/bash

URL="http://localhost:3010/api/sessions"
LOG_FILE="/var/log/datahub_api/curl_sessions.log"

curl -s -X POST "$URL" >> "$LOG_FILE" 2>&1
echo "---- $(date '+%Y-%m-%d %H:%M:%S') ----" >> "$LOG_FILE"


crontab -e
*/10 * * * * /data/scripts/call_sessions_api.sh