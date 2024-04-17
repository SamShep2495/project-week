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

    const validSortBys = ['article_id', 'title', 'topic', 'author', 'created_at', 'article_img_url']
    if (!validSortBys.includes(sort_by)) {
        return Promise.reject({ status: 400, message: 'invalid query value'})
    }
    let sqlString = `SELECT * FROM articles `
    sqlString += `ORDER BY ${sort_by} ${order}`
    
    return db.query(sqlString).then(({ rows }) => {
        return rows
    });
};

function getThemCommentsById(id, sort_by = 'created_at', order = 'ASC') {

    const validSortBys = ['comments_id', 'votes', 'created_at', 'author', 'body', 'article_id']
    const queryValue = []
    if (!validSortBys.includes(sort_by)) {
        return Promise.reject({ status: 400, message: 'invalid query value'})
    }
    let sqlString = `SELECT * FROM comments `
    if(id) {
        queryValue.push(id);
        sqlString += `WHERE article_id = $1 `
    }
    sqlString += `ORDER BY ${sort_by} ${order}`
    
    return db.query(sqlString, queryValue).then(({ rows }) => {
        return rows
    })
}

function PostThatComment(newComment, article_id) {
    
    let sqlString = `INSERT INTO comments (body, author, article_id) VALUES ($1, $2, $3) RETURNING *`

    const queryValue = [newComment.body, newComment.username, article_id]
    return db.query(sqlString, queryValue).then(({ rows }) => {
        return rows[0]
    })
}

function deleteThemComments(comment_id) {
    return db.query(`SELECT * FROM comments WHERE comment_id=$1`,[comment_id]).then(({ rows }) => {
        return rows
    })
}

function getThemUsers() {
    return db.query(`SELECT * FROM users`).then(({ rows }) => {
        return rows
    })
}

module.exports = {getThatTopic, getThatApi, getThemArticlesById, getThemArticles, getThemCommentsById, PostThatComment, deleteThemComments, getThemUsers}