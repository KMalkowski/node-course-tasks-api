const express = require('express')
const Task = require('../models/task')
const router = new express.Router

router.get('/tasks', async (req, res)=>{
    try{
        const tasks = await Task.find({})
        res.send(tasks)
    }catch(err){
        res.status(500).send()
    }
})

router.get('/tasks/:id', async (req, res)=>{
    try{
        const task = await Task.findById(req.params.id)
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(err){
        res.status(500).send()
    }
})

router.post('/tasks', async (req, res)=>{
    const task = new Task(req.body)
    try{
        await task.save()
        res.status(201).send('Task ' + task + 'created successfully!')
    }catch(err){
        res.status(400).send('Task failed' + err)
    }
})

router.patch('/tasks/:id', async (req, res) => {
    const allowedUpdates = ['description', 'done']
    const updates = Object.keys(req.body)
    const isValidUpdate = updates.every((update)=>allowedUpdates.includes(update))
    
    if(!isValidUpdate){
        return res.status(400).send({err: 'Ivalid update!'})
    }
    
    try{
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        if(!task){
            res.status(404).send()
        }
        res.status(201).send(task)
    }catch(err){
        res.status(400).send(err)
    }
})

router.delete('/tasks/:id', async (req, res)=>{
    try{
        const task = await Task.findByIdAndDelete(req.params.id)
        if(!task){
            res.status(404).send()
        }

        res.send('Task ' + task.id + ' deleted.')
    }catch(err){
        res.status(500).send()
    }
})

module.exports = router