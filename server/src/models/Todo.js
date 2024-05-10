const mongoose = require('mongoose')
const moment = require('moment')

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

todoSchema.path('category').validate(function(value){
    return /오락|공부|음식|자기계발|업무|패션|여행/.test(value)
}, 'category `{VALUE}` 는 유효하지 않은 카테고리입니다.')

todoSchema.virtual('status').get(function(){
    return this.isDone ? "종료" : "진행중"
})

todoSchema.virtual('createdAgo').get(function(){
    return moment(this.createdAt).fromNow()
})

todoSchema.virtual('lastModifiedAgo').get(function(){
    return moment(this.lastModifiedAt).fromNow()
})

todoSchema.virtual('finishedAgo').get(function(){
    return moment(this.finishedAt).fromNow()
})

const Todo = mongoose.model('Todo', todoSchema)
module.exports = Todo


// const todo = new Todo({
//     author: '111111111111111111111111',
//     title: '주말에 공원 산책하기',
//     description: '주말에 집 주변 공원에 가서 .....'
// })
// todo.save().then(() => console.log('할일 생성 성공'))