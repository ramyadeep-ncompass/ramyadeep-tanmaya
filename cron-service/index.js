const cron = require('node-cron');
const { runQueryAsync } = require('./db');
const fetch = require('node-fetch');
const { logger } = require('./logger');
require('dotenv').config();


cron.schedule('0 0 * * * *', async() => {
    updateRepos();
});

async function updateRepos() {
    console.log('Cron Service called!');
    await runQueryAsync('TRUNCATE repo;');

    const response = await runQueryAsync('SELECT username FROM user;');

    if (response.error) {
        throw new Error(response.error);
    }

    const users = response.result;

    for (let i = 0; i < users.length; i++) {
        const url = `https://api.github.com/users/${users[i].username}/repos`;

        const response = await fetch(url, {
            header: {
                'authorization': 'token ' + process.env.GITHUB_TOKEN
            }
        });

        const userRepos = await response.json();

        for (let j = 0; j < userRepos.length; j++) {
            const query = `INSERT INTO repo (repositoryOwner,repositoryName,repositoryId,email,repositoryUrl,cloneUrl,contributorsUrl)
            VALUES ('${userRepos[j].owner.login}','${userRepos[j].name}','${userRepos[j].id}','${userRepos[j].email}','${userRepos[j].owner.repos_url}','${userRepos[j].clone_url}','${userRepos[j].contributors_url}')`;
            await runQueryAsync(query);
        }
    }
    logger({ message: 'Fetch repository api called', status: 'INFO' });
}

updateRepos()