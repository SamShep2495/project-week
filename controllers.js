const {getThatTopic, getThatApi, getThemArticles} = require("./models")

function getTopics(req, res, next) {
    getThatTopic().then((topic) => {
        res.status(200).send({topics: topic})
    }).catch((err) => {
        next(err);
    });
};

function getApi(req, res, next) {
    getThatApi().then((api) => {
        res.status(200).send(api)
    }).catch((err) => {
        next(err);
    });
};

function getArticle(req, res, next) {
    const {article_id} = req.params
    getThemArticles(article_id).then((article) => {
        if (article.length === 0) {
            return Promise.reject({ status: 400, message: 'invalid query value'})
        }
        res.status(200).send(article)
    }).catch((err) => {
        next(err);
    });
};

module.exports = {getTopics, getApi, getArticle}