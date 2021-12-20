const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router


//GET /tasks?done=true
//GET /tasks?limit=3&skip=6
//GET /tasks?sortBy=createdAt:desc
router.get('/tasks', auth, async (req, res)=>{
    const match = {}
    const sort = {}

    if(req.query.done){
        match.done = req.query.done === 'true'
    }
    
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try{
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        })
        res.send(req.user.tasks)
    }catch(err){
        res.status(500).send()
    }
})

router.get('/tasks/:id', auth, async (req, res)=>{
    const _id = req.params.id
    try{
        const task = await Task.findOne({_id, owner: req.user._id})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(err){
        res.status(500).send()
    }
})

router.post('/tasks', auth, async (req, res)=>{
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try{

        await task.save()
        res.status(201).send('Task ' + task + 'created successfully!')
    }catch(err){
        res.status(400).send('Task failed' + err)
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const allowedUpdates = ['description', 'done']
    const updates = Object.keys(req.body)
    const isValidUpdate = updates.every((update)=>allowedUpdates.includes(update))
    
    if(!isValidUpdate){
        return res.status(400).send({err: 'Ivalid update!'})
    }
    
    try{
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})
        
        if(!task){
            res.status(404).send()
        }

        updates.forEach((update)=>task[update] = req.body[update])
        await task.save()

        res.status(201).send(task)
    }catch(err){
        res.status(400).send(err)
    }
})

router.delete('/tasks/:id', auth, async (req, res)=>{
    try{
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})
        if(!task){
            res.status(404).send()
        }

        res.send('Task ' + task.id + ' deleted.')
    }catch(err){
        res.status(500).send()
    }
})

module.exports = router