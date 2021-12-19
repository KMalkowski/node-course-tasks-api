const mongoose = require('mongoose')
const validator = require('validator')

const Task = mongoose.model('Task', {
    description: {
        type: String,
        required: true
    },
    done: {
        type: Boolean
    },
    time: {
        type: Number, 
        validate(value){
            if(value < 0){
                throw new Error("Time must be a positive number")
            }
        }
    }
})

module.exports = Task