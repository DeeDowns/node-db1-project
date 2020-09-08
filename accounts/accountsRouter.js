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

router.get('/:id', validateAccountId, (req, res) => {
    res.status(200).json(req.account)
   
    // const { id } = req.params
    // db('accounts')
    // .where({id: id})
    // .then(account => {
    //     console.log(account)
    //     res.status(200).json({ data: account })
    // })
    // .catch(error => {
    //     console.log(error)
    //     res.status(500).json({ message: error.message })
    // })
})

router.post('/', validateAccount, (req, res) => {
    const newAccount = req.body

    db('accounts')
    .insert(newAccount)
    .returning('id')
    .then(id => {
        console.log(id)
        res.status(201).json({ inserted: id })
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({ message: error.message })
    })

})

router.put('/:id', validateAccountId, validateAccount, (req, res) => {
    const changes = req.body
    const { id } = req.params
   
    db('accounts')
    .where({ id: id})
    .update(changes)
    .then(count => {
        console.log(count)
        res.status(200).json({ message: 'account updated' })
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({ message: error.message })
    })
})

router.delete('/:id', validateAccountId, (req, res) => {
    const { id } = req.params

    db('accounts')
    .where({ id: id})
    .del()
    .then(count => {
        console.log(count)
        if(count > 0) {
        res.status(200).json({ message: 'account deleted' })
        }
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({ message: 'error deleting account' })
    })
})



/******** custom middleware **********/

function validateAccount(req, res, next) {
    const { name, budget } = req.body

    if(!req.body) {
        res.status(400).json({ message: 'missing account data' })
    } else if (!name || !budget) {
        res.status(400).json({ message: 'account must include name and budget' })
    } else {
        next()
    }
}

function validateAccountId(req, res, next) {
    const { id } = req.params

    db('accounts')
    .where({id: id})
    .then(account => {
        if (account.length <= 0) {
            res.status(404).json({ message: 'account not found'})
        } else {
            req.account = account
            next()
        }
    })
    .catch(error => {
        res.status(500).json({ message: error.message })
    })
}

module.exports = router