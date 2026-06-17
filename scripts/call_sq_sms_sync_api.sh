URL="http://localhost:3010/api/sq-sms-sync"
LOG_FILE="/var/log/datahub_api/curl_sq_sms_sync.log"

curl -s -X POST "$URL" >> "$LOG_FILE" 2>&1
echo "---- $(date '+%Y-%m-%d %H:%M:%S') ----" >> "$LOG_FILE"

# crontab -e
# 0 * * * * /data/scripts/call_sq_sms_sync_api.sh
