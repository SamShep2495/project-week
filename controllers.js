const {getThatTopic, getThemArticlesById, getThemArticles, getThemCommentsById, 
    PostThatComment, deleteThemComments, getThemUsers, getThemUsersById, 
    getThemCommentsByCommentId, postThatArticle} = require("./models")
const myRequest =  require("./db/data/test-data/comments")
const myRequest2 = require("./endpoints.json")

function getTopics(req, res, next) {
    getThatTopic().then((topic) => {
        res.status(200).send({topics: topic})
    }).catch((err) => {
        next(err);
    });
};

function getApi(req, res, next) {
    res.status(200).send({apis: myRequest2})
}

function getArticleById(req, res, next) {
    const {article_id} = req.params
    getThemArticlesById(article_id).then((articles) => {

        res.status(200).send(articles)
    }).catch((err) => {
        next(err);
    });
};

function getArticle(req, res, next) {
    const { sort_by } = req.query
    const { order } = req.query
    const { topic } = req.query
    getThemArticles(sort_by, order).then((articles) => {

        if (articles.length === 0) {
            return Promise.reject({ status: 400, message: 'invalid query value'})
        }
        
        validTopics = []
        articles.forEach(element => {
            validTopics.push(element.topic)
        });
        let valTopics = [...new Set(validTopics)]

        let specificTopic = []
        if(!topic){
            res.status(200).send({ articles });
        } else if (valTopics.includes(topic)) {
            articles.forEach(element => {
                if (element.topic === topic) {
                    specificTopic.push(element)
                }
            })
            res.status(200).send({ specificTopic })
        } else {
            res.status(404).send({ message: 'Invalid topic'})
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
    const newComment = req.body;
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

function getUserById(req, res, next) {
    const { username } = req.params
    getThemUsersById(username).then((user) => {
        if (user.length === 0) {
            return Promise.reject({ status: 404, message: 'Invalid endpoint'})
        }
        res.status(200).send({user})
    }).catch((err) => {
        next(err);
    })
}

function patchUserById(req, res, next) {
    const { comment_id } = req.params
    const { inc_votes } = req.body
    getThemCommentsByCommentId(comment_id).then((comment) => {
        if (comment.length === 0) {
            return Promise.reject({ status: 404, message: 'Not Found'})
        }
        comment[0].votes = comment[0].votes + inc_votes
        res.status(200).send({comment})
    }).catch((err) => {
        next(err);
    });  
};

function postArticle(req, res, next) {
    const newArticle = req.body
    postThatArticle(newArticle).then((article) => {
        res.status(201).send({article: article})
    }).catch((err) => {
        next(err)
    })
}


module.exports = {getTopics, getApi, getArticleById, getArticle, getCommentById, 
                postComment, patchArticleById, deleteCommentById, getUsers, 
                getUserById, patchUserById, postArticle}