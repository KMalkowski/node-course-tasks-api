const express = require('express')
const User = require('../models/user')
const router = new express.Router()

router.get('/users', async (req, res)=>{
    try{
        const users = await User.find({})
        res.send(users)
    }catch(err){
        res.status(500).send()
    }
})

router.get('/users/:id', async (req, res)=>{
    const _id = req.params.id
    try{
        const user = await User.findById(_id)
        if(!user){
            return res.status(404).send()
        }
        res.send(user)
    }catch(err){
        res.status(500).send()
    }
})

router.patch('/users/:id', async (req, res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']

    const isValidUpdate = updates.every((update)=> allowedUpdates.includes(update))

    if(!isValidUpdate){
        return res.status(400).send({err: 'invalid updates!'})
    }

    try{
        const user = await User.findById(req.params.id)
        updates.forEach((update)=> user[update] = req.body[update])
        await user.save()

        if(!user){
            res.status(404).send()
        }
        res.status(201).send(user)
    }catch(err){
        res.status(400).send(err)
    }
})

router.delete('/users/:id', async(req, res)=>{
    try{
        const user = await User.findByIdAndDelete(req.params.id)
        if(!user){
            return res.status(404).send()
        }
        res.send('User ' + user.id + ' has been deleted!')
    }catch(err){
        res.status(500).send()
    }
})

router.post('/users', async (req, res)=>{
    const user = new User(req.body)

    try{
        await user.save()
        res.status(201).send(user)
    }catch (err){
        res.status(500).send()
    }
})

router.post('/login', async (req, res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        res.status(201).send(user)
    }catch(err){
        res.status(400).send()
    }
})

module.exports = router