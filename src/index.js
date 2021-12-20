require('dotenv').config()
const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT || 3000

// ->> express middleware function
// app.use((req, res, next)=>{
//     console.log(req.method, req.path)
//     next()
// })

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, ()=>{
    console.log('app listening on port ' + port)
})

// const jwt = require('jsonwebtoken')
// const myFunction = async () => {
//     const token = jwt.sign({_id: 'abc123'}, 'gaelknanlkehte9832h', {expiresIn: '7 days'})
//     console.log(token)

//     const data = jwt.verify(token, 'gaelknanlkehte9832h')
//     console.log(data)
// }

// myFunction()