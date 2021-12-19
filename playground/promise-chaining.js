require('../src/db/mongoose')
const User = require('../src/models/user')

// User.findByIdAndUpdate('61be5dff4216a7d38c600b24', {age: 1}).then((user)=>{
//     console.log(user)
//     return User.countDocuments({age: 1})
// }).then((result)=>{
//     console.log(result)
// }).catch(err=>{
//     console.log(err)
// })

const updateAgeAndCountDocuments = async (id, age) => {
    const user = await User.findByIdAndUpdate(id, {age})
    const documents = await User.countDocuments({age})
    return documents
}

updateAgeAndCountDocuments('61be5dff4216a7d38c600b24', 1).then((result)=>{
    console.log(result)
})