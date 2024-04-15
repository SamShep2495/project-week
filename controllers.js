const {getThatTopic} = require("./models")

function getTopics(req, res, next) {
    getThatTopic().then((topic) => {
        res.status(200).send({topics: topic})
    })
}

module.exports = {getTopics}