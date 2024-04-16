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

function getThemArticlesById(id) {
    return db.query(`SELECT * FROM articles WHERE article_id=$1`,[id]).then(({ rows }) => {
        return rows
    })
}

function getThemArticles(sort_by = 'article_id', order = 'ASC') {

    const ValidSortBys = ['article_id', 'title', 'topic', 'author', 'created_at', 'article_img_url']
    if (!ValidSortBys.includes(sort_by)) {
        return Promise.reject({ status: 400, message: 'invalid query value'})
    }
    let sqlString = `SELECT * FROM articles `
    sqlString += `ORDER BY ${sort_by} ${order}`
    
    return db.query(sqlString).then(({ rows }) => {
        return rows
    });
};


module.exports = {getThatTopic, getThatApi, getThemArticlesById, getThemArticles}