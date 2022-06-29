const fs = require('fs');
const redis = require('redis');
const client = redis.createClient();

client.on('connect', function() {
    console.log('Connected!');
});

async function logger(args) {
    const ts = new Date();

    args.timestamp = ts.getDate() + '-' + ts.getMonth() + '-' + ts.getFullYear() + ' : ' + ts.getHours() + '-' + ts.getMinutes() + '-' + ts.getSeconds();
    fs.appendFile("cron-logs.txt", JSON.stringify(args) + '\n', (err) => {
        if (err)
            console.log(err);
    });
    client.set('last-updated', args.timestamp);
    client.expire('last-updated', 3600);
}

module.exports = { logger }