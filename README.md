# trade

JIRA: https://kimtintr.atlassian.net/jira/software/projects/BF/boards/1/backlog

require install java 11 for antlr

get chatid telegram:
https://api.telegram.org/bot<YourBOTToken>/getUpdates

check disk 
du -h --max-depth=1
sudo rm /var/lib/apport/coredump/*


fix out of heap memory
pm2 start botFather.js --node-args="--max-old-space-size=32768" --log-date-format "YYYY.MM.DD HH:mm:ss.SSS Z"
pm2 start arbitrageSpotFuture.js --log-date-format "YYYY.MM.DD HH:mm:ss.SSS Z"