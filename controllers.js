const {getThatTopic, getThatApi} = require("./models")

function getTopics(req, res, next) {
    getThatTopic().then((topic) => {
        res.status(200).send({topics: topic})
    })
}

function getApi(req, res, next) {
    getThatApi().then((api) => {
        res.status(200).send(api)
    })
}

module.exports = {getTopics, getApi}