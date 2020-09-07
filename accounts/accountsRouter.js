const express = require('express')

const db = require('../data/dbConfig.js')

const router = express.Router()

router.get('/', (req, res) => {
    db('accounts')
    .then(accounts => {
        console.log(accounts)
        res.status(200).json({ data: accounts })
    }) 
    .catch(error => {
        console.log(error)
        res.status(500).json({ message: error.message })
    })
})

router.get('/:id', (req, res) => {
    const { id } = req.params
    db('accounts')
    .where({id: id})
    .then(account => {
        console.log(account)
        res.status(200).json({ data: account })
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({ message: error.message })
    })
})




module.exports = router