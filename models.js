const db = require("./db/connection.js")
const { readFile } = require("fs/promises");
const { map } = require("./db/data/test-data/topics.js");


function getThatTopic() {
    return db.query(`SELECT * FROM topics;`).then(({ rows }) => {
        return rows
    })
}

function getThemArticlesById(id) {

    let sqlString = `SELECT articles.*, 
    COALESCE(comments.comment_count, 0) 
    AS comment_count FROM articles 
    LEFT JOIN (SELECT article_id, COUNT(*) AS comment_count FROM comments GROUP BY article_id) AS comments 
    ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1`
    
    return db.query(sqlString,[id]).then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, message: 'Not Found'})
        }
        rows.map((article) => {
            article.comment_count = Number(article.comment_count)
        })
        return rows
    })
}

function getThemArticles(sort_by = 'created_at', order = 'ASC') {

    const validSortBys = ['article_id', 'title', 'topic', 'author', 'created_at', 'article_img_url']
    if (!validSortBys.includes(sort_by)) {
        return Promise.reject({ status: 400, message: 'invalid query value'})
    }

    let sqlString = `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, 
    COALESCE(comments.comment_count, 0) 
    AS comment_count FROM articles 
    LEFT JOIN (SELECT article_id, COUNT(*) AS comment_count FROM comments GROUP BY article_id) AS comments 
    ON articles.article_id = comments.article_id `

    sqlString += `ORDER BY ${sort_by} ${order}`
    
    return db.query(sqlString).then(({ rows }) => {
        rows.map((article) => {
            article.comment_count = Number(article.comment_count)
        })
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
    
    const sqlString = `INSERT INTO comments (body, author, article_id) VALUES ($1, $2, $3) RETURNING *`

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

function getThemUsersById(username) {
    return db.query(`SELECT * FROM users WHERE username=$1`,[username]).then(({ rows }) => {
        return rows
    })
}

function getThemCommentsByCommentId(comment_id) {
    return db.query(`SELECT * FROM comments WHERE comment_id=$1`,[comment_id]).then(({ rows }) => {
        return rows        
    })
}

module.exports = {getThatTopic, getThemArticlesById, getThemArticles, 
                getThemCommentsById, PostThatComment, deleteThemComments, 
                getThemUsers, getThemUsersById, getThemCommentsByCommentId}