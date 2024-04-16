const { map } = require("./app");
const { forEach } = require("./db/data/test-data/articles");
const {getThatTopic, getThatApi, getThemArticlesById, getThemArticles, getThemCommentsById} = require("./models")

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

function getArticleById(req, res, next) {
    const {article_id} = req.params
    getThemArticlesById(article_id).then((article) => {
        if (article.length === 0) {
            return Promise.reject({ status: 400, message: 'invalid query value'})
        }
        res.status(200).send(article)
    }).catch((err) => {
        next(err);
    });
};

function getArticle(req, res, next) {
    const { sort_by } = req.query
    const { order } = req.query
    getThemArticles(sort_by, order).then((articles) => {
        articles.map((article) => {
            delete article.body
        })
        res.status(200).send({ articles });
    }).catch((err) => {
        next(err);
    })
};

function getCommentById(req, res, next) {
    const { article_id } = req.params
    getThemCommentsById(article_id).then((comments) => {
        if (comments.length === 0) {
            return Promise.reject({ status: 400, message: 'invalid query value'})
        }
        res.status(200).send({ comments })
    }).catch((err) => {
        next(err);
    });
}

module.exports = {getTopics, getApi, getArticleById, getArticle, getCommentById}