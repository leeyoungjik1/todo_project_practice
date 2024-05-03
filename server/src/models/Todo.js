const mongoose = require('mongoose')

const { Schema } = mongoose
const { Types: { ObjectId } } = Schema

const todoSchema = new Schema({
    author: {
        type: ObjectId,
        required: true,
        ref: 'User'
    },
    category: {
        type: String,
        requried: true,
        trim: true
    },
    imgUrl: {
        type: String,
        requried: true,
        trim: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    isDone: {
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
    },
    finishedAt: {
        type: Date,
        default: Date.now
    }
})

const Todo = mongoose.model('Todo', todoSchema)
module.exports = Todo


// const todo = new Todo({
//     author: '111111111111111111111111',
//     title: '주말에 공원 산책하기',
//     description: '주말에 집 주변 공원에 가서 .....'
// })
// todo.save().then(() => console.log('할일 생성 성공'))