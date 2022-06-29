const fs = require('fs');

async function logger(args) {
    const ts = new Date();

    args.timestamp = ts.getDate() + '-' + ts.getMonth() + '-' + ts.getFullYear() + ' : ' + ts.getHours() + '-' + ts.getMinutes() + '-' + ts.getSeconds();
    fs.appendFile("cron-logs.txt", JSON.stringify(args) + '\n', (err) => {
        if (err)
            console.log(err);
    });
}

module.exports = { logger }