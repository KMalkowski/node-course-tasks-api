const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.get('/users', (req, res)=>{
    User.find({}).then(users=>{
        res.send(users)
    }).catch(()=>{
        res.status(500).send()
    })
})

app.get('/users/:id', (req, res)=>{
    const _id = req.params.id
    User.findById(_id).then((user)=>{
        if(!user){
            return res.status(404).send()
        }
        res.send(user)
    }).catch(()=>{
        res.status(500).send()
    })
})

app.post('/users', (req, res)=>{
    const user = new User(req.body)
    user.save().then(()=>{
        res.send(user)
    }).catch(err=>{
        res.status(400)
        res.send(err)
    })
})

app.get('/tasks', (req, res)=>{
    Task.find({}).then((tasks)=>{
        res.send(tasks)
    }).catch(()=>{
        res.status(500).send()
    })
})

app.get('/tasks/:id', (req, res)=>{
    Task.findById(req.params.id).then((task)=>{
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }).catch(()=>{
        res.status(500).send()
    })

})

app.post('/tasks', (req, res)=>{
    const task = new Task(req.body)
    task.save().then(()=>{
        res.status(201).send('Task ' + task + 'created successfully!')
    }).catch((err)=>{
        res.status(400).send('Task failed' + err)
    })
})

app.listen(port, ()=>{
    console.log('app listening on port ' + port)
})