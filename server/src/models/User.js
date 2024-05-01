const mongoose = require('mongoose')

const { Schema } = mongoose

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastModifiedAt: {
        type: Date,
        default: Date.now
    }
})

const User = mongoose.model('User', userSchema)
module.exports = User



// const user = new User({
//     name: '태양',
//     email: 'sun@gmail.com',
//     userId: 'sunrise',
//     password: '1234567',
//     isAdmin: true
// })
// user.save().then(() => console.log('회원가입 성공'))