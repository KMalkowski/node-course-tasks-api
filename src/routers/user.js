const express = require('express')
const sharp = require('sharp')
const User = require('../models/user')
const router = new express.Router()
const auth = require('../middleware/auth')
const multer = require('multer')
const {sendWelcomeEmail, sendByeEmail} = require('../emails/account')

//my profile
router.get('/users/me', auth, async (req, res)=>{
    res.send(req.user)
})

//get user's profile
router.get('/users/:id', auth, async (req, res)=>{
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

//update user
router.patch('/me', auth, async (req, res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']

    const isValidUpdate = updates.every((update)=> allowedUpdates.includes(update))

    if(!isValidUpdate){
        return res.status(400).send({err: 'invalid updates!'})
    }

    try{
        updates.forEach((update)=> req.user[update] = req.body[update])
        await req.user.save()

        res.status(201).send(req.user)
    }catch(err){
        res.status(400).send(err)
    }
})

//delete user
router.delete('/me', auth, async(req, res)=>{
    try{
        await req.user.remove()
        sendByeEmail(req.user.email, req.user.name)
        res.send('Your account has been deleted!')
    }catch(err){
        res.status(500).send()
    }
})

//register new user
router.post('/users', async (req, res)=>{
    const user = new User(req.body)

    try{
        await user.save()
        const token = await user.generateAuthToken()
        sendWelcomeEmail(user.email, user.name)
        res.status(201).send({user, token}) 
    }catch (err){
        console.log(err)
        res.status(500).send(err)
    }
})

//login user
router.post('/login', async (req, res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({
            user, 
            token
        })
    }catch(err){
        res.status(400).send()
    }
})

//logout user
router.post('/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    }catch(err){
        res.status(500).send()
    }
})

//logout user from all sessions 
router.post('/logout-all-sessions', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    }catch(err){
        res.status(500).send()
    }
})

const upload = multer({
    limits:{
        fileSize: 1000000
    },
    fileFilter(req, file, callback){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return callback(new Error('Only jpg, jpeg or png images accepted!'))
        }

        //everything fine, go ahead
        callback(undefined, true)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res)=>{
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (err, req, res, next)=>{
    res.status(400).send({error: err.message})
})

router.delete('/users/me/avatar', auth, async (req, res)=>{
    req.user.avatar = undefined
    await req.user.save()

    res.send()
})

router.get('/users/me/avatar', auth, async (req, res)=> {
    try{
       if(!req.user.avatar){
           throw new Error('no avatar added yet')
       } 
       res.set('Content-Type', 'image/png')
       res.send(req.user.avatar)
    }catch(err){
        res.status(404).send()
    }
})

module.exports = router