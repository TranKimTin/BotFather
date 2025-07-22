import cron from 'node-cron';
import moment from 'moment';
import * as mysql from './WebConfig/lib/mysql';

async function runDailyTask() {

    console.log(`[✓] Task run: ${moment().format("YYYY-MM-DD HH:mm:ss")}`);

    const sql_query = `SELECT b.id, userID, botName, symbolList, timeframes
                        FROM Bot b
                        JOIN User u ON b.userID = u.id
                        WHERE u.premiumDate < ? AND symbolList <> '[]' AND timeframes <> '[]';`;
    const botList: Array<any> = (await mysql.query(sql_query, [new Date().getTime()]))
        .map((item: any) => {
            item.timeframes = JSON.parse(item.timeframes);
            item.symbolList = JSON.parse(item.symbolList);
            return item;
        });

    let total = 0;

    for (const bot of botList) {
        const price = 100;
        const nSymbol: number = bot.symbolList.length;
        const nTimeftame: number = bot.timeframes.length;
        const botID: number = bot.id!;
        const userID = bot.userID;

        const amount = nSymbol * nTimeftame * price;
        total += amount;
        console.log(bot.botName, amount / 1000);

        const connection = await mysql.getConnection();
        await mysql.query_transaction(connection,
            `INSERT INTO Payments(amount, createdTime, userID, botID, note) VALUES (?,?,?,?,?)`,
            [amount, new Date().getTime(), userID, botID, `${nSymbol} symbols, ${nTimeftame} timeframes`]
        );
        await mysql.query_transaction(connection,
            `UPDATE User
                SET credit = GREATEST(credit - ?, 0),
                    balance = balance - GREATEST(? - credit, 0)
                WHERE id = ?`,
            [amount, amount, userID]
        );
        connection.release();
    }

    console.log(`[✓] Task done: ${moment().format("YYYY-MM-DD HH:mm:ss")}`);
    console.log(`Total: ${total.toLocaleString()} đ`);
}

// minute(0-59) hour(0-23) dayOfMonth(1-31) monthOfYear(1-12) dayOfWeek(0-7)
cron.schedule('5 7 * * *', () => {
    // 07:05 daily
    runDailyTask();
});

console.log(`[~] Cronjob started at ${moment().format("YYYY-MM-DD HH:mm:ss")}`);