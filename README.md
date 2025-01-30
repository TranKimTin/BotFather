# trade

require install java 11 for antlr

get chatid telegram:
https://api.telegram.org/bot<YourBOTToken>/getUpdates

check disk 
du -h --max-depth=1
sudo rm /var/lib/apport/coredump/*


fix out of heap memory
pm2 start socket_binance.js --node-args="--max-old-space-size=8192" --log-date-format "YYYY.MM.DD HH:mm:ss.SSS Z"
pm2 start socket_bybit.js --node-args="--max-old-space-size=8192" --log-date-format "YYYY.MM.DD HH:mm:ss.SSS Z"
pm2 start socket_okx.js --node-args="--max-old-space-size=8192" --log-date-format "YYYY.MM.DD HH:mm:ss.SSS Z"
pm2 start socket_bybit_future.js --node-args="--max-old-space-size=8192" --log-date-format "YYYY.MM.DD HH:mm:ss.SSS Z"
pm2 start socket_binance_future.js --node-args="--max-old-space-size=8192" --log-date-format "YYYY.MM.DD HH:mm:ss.SSS Z"