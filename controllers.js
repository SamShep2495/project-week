const { map } = require("./app");
const { forEach } = require("./db/data/test-data/articles");
const {getThatTopic, getThatApi, getThemArticlesById, getThemArticles, getThemCommentsById, PostThatComment, deleteThemComments, getThemUsers} = require("./models")

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
    const { filter_by_topic } = req.query
    getThemArticles(sort_by, order).then((articles) => {

        if (articles.length === 0) {
            return Promise.reject({ status: 400, message: 'invalid query value'})
        }
        articles.map((article) => {
            delete article.body
        })

        validTopics = []
        articles.forEach(element => {
            validTopics.push(element.topic)
        });
        let valTopics = [...new Set(validTopics)]

        if(!filter_by_topic){
            res.status(200).send({ articles });
        } else if (valTopics.includes(filter_by_topic)) {
            let specificTopic = []
            articles.forEach(element => {
                if (element.topic === filter_by_topic) {
                    specificTopic.push(element)
                    res.status(200).send({ specificTopic })
                }
            })
        } else {
            res.status(400).send({ message: 'Invalid topic'})
        }
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

function postComment(req, res, next) {
    const { article_id } = req.params
    let newComment = req.body;
    PostThatComment(newComment, article_id).then((comment) => {
        res.status(201).send({comment: comment});
    }).catch((err) => {
        next(err);
    });
};

function patchArticleById(req, res, next) {
    const {article_id} = req.params
    const { inc_votes } = req.body
    getThemArticlesById(article_id).then((article) => {
        if (article.length === 0) {
            return Promise.reject({ status: 400, message: 'invalid query value'})
        }
        article[0].votes = article[0].votes + inc_votes
        res.status(200).send({articles: article})
    }).catch((err) => {
        next(err);
    });
};

function deleteCommentById(req, res, next) {
    const { comment_id } = req.params
    deleteThemComments(comment_id).then((comment) => {
        if (comment.length === 0) {
            return Promise.reject({ status: 400, message: 'invalid query value'})
        }
        res.status(204).send({comment: comment[0]})
    }).catch((err) => {
        next(err);
    });
}

function getUsers(req, res, next) {
    getThemUsers().then((user) => {
        if (user.length === 0) {
            return Promise.reject({ status: 404, message: 'Invalid endpoint'})
        }
        res.status(200).send({users: user})
    }).catch((err) => {
        next(err);
    });
}

module.exports = {getTopics, getApi, getArticleById, getArticle, getCommentById, postComment, patchArticleById, deleteCommentById, getUsers}