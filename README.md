# trade

get chatid telegram:
https://api.telegram.org/bot<YourBOTToken>/getUpdates

fix out of heap memory
pm2 start socket_price_server.js --node-args="--max-old-space-size=4096" --log-date-format "YYYY.MM.DD HH:mm:ss.SSS Z"