const express = require("express");

const db = require("../data/dbConfig.js");
const accountsRouter = require('../accounts/accountsRouter.js')

const server = express();

server.use(logger)
server.use(express.json());

server.use('/api/accounts', accountsRouter)


server.get('/', (req, res) => {
    res.status(200).json({ api: 'server uppppp' })
})


function logger(req, res, next) {
    console.log(`a ${req.method} request was made to ${req.url}`)
    next()
}

module.exports = server;
