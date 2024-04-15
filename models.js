const db = require("./db/connection.js")
const { readFile } = require("fs/promises");

function getThatTopic() {
    return db.query(`SELECT * FROM topics;`).then(({ rows }) => {
        return rows
    })
}

function getThatApi() {
    return readFile('./endpoints.json', 'utf-8').then((fileContent) => {
        const apis = JSON.parse(fileContent);
        return body = { apis }
    })
}

function getThemArticles(id) {
    return db.query(`SELECT * FROM articles WHERE article_id=$1`,[id]).then(({ rows }) => {
        return rows
    })
}


module.exports = {getThatTopic, getThatApi, getThemArticles}