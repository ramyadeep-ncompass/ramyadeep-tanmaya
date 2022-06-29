const fs = require('fs');
const redis = require('redis');
const client = redis.createClient();



async function logger(args) {
    const ts = new Date();

    args.timestamp = ts.getDate() + '-' + ts.getMonth() + '-' + ts.getFullYear() + ' : ' + ts.getHours() + '-' + ts.getMinutes() + '-' + ts.getSeconds();
    fs.appendFile("cron-logs.txt", JSON.stringify(args) + '\n', (err) => {
        if (err)
            console.log(err);
    });

    await client.connect();

    client.set('last-updated', args.timestamp);
    client.expire('last-updated', 3600);
    client.disconnect();

}

module.exports = { logger }