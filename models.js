const db = require("./db/connection.js")

function getThatTopic() {
    return db.query(`SELECT * FROM topics;`).then(({ rows }) => {
        return rows
    })
}

module.exports = {getThatTopic}