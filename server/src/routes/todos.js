const express = require('express')
const Todo = require('../models/Todo')
const expressAsyncHandler = require('express-async-handler')
const { isAuth, isAdmin, isFieldValid } = require('../../auth')
const mongoose = require('mongoose')
const { Types: { ObjectId }} = mongoose
const {
    validateTodoTitle,
    validateTodoDescription,
    validateTodoCategory
} = require('../../validator')
const { validationResult } = require('express-validator')

const router = express.Router()

router.get('/', isAuth, expressAsyncHandler(async (req, res, next) => {
    const todos = await Todo.find({ author: req.user._id }).populate('author', ['name', 'userId'])
    if(todos.length === 0){
        res.status(404).json({code: 404, message: 'Failed to find todos'})
    }else{
        res.json({code: 200, todos})
    }
}))
router.get('/:id', isAuth, expressAsyncHandler(async (req, res, next) => {
    const todo = await Todo.findOne({
        author: req.user._id,
        _id: req.params.id
    })
    if(!todo){
        res.status(404).json({code: 404, message: 'Todo Not Found'})
    }else{
        res.json({code: 200, todo})
    }
}))
router.post('/', [
    validateTodoTitle(),
    validateTodoDescription(),
    validateTodoCategory()
], isAuth, expressAsyncHandler(async (req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        console.log(errors.array())
        res.status(400).json({ 
            code: 400, 
            message: 'Invalid Form data for todo',
            error: errors.array()
        })
    }else{
        const searchedTodo = await Todo.findOne({
            author: req.user._id,
            title: req.body.title
        })
        if(searchedTodo){
            res.json({code: 204, message: "Todo you want to create already exists in DB"})
        }else{
            const todo = new Todo({
                author: req.user._id,
                title: req.body.title,
                description: req.body.description,
                category: req.body.category,
                imgUrl: req.body.imgUrl
            })
            const newTodo = await todo.save()
            if(!newTodo){
                res.status(401).json({code: 401, message: 'Failed to save todo'})
            }else{
                res.status(201).json({
                    code: 201,
                    message: 'New Todo Created',
                    newTodo
                })
            }
        }
    }
}))
router.put('/:id', [
    validateTodoTitle(),
    validateTodoDescription(),
    validateTodoCategory()
], isAuth, expressAsyncHandler(async (req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
      console.log(errors.array())
      res.status(400).json({ 
          code: 400, 
          message: 'Invalid Form data for todo',
          error: errors.array()
      })
    }else{
        const todo = await Todo.findOne({
            author: req.user._id,
            _id: req.params.id
        })
        if(!todo){
            res.status(404).json({code: 404, message: 'Todo Not Found'})
        }else{
            todo.title = req.body.title || todo.title
            todo.description = req.body.description || todo.description
            todo.isDone = req.body.isDone || todo.isDone
            todo.category = req.body.category || todo.category
            todo.imgUrl = req.body.imgUrl || todo.imgUrl
            todo.lastModifiedAt = new Date()
            todo.finishedAt = todo.isDone ? todo.lastModifiedAt : todo.finishedAt
    
            const updatedTodo = await todo.save()
            res.json({
                code: 200,
                message: 'Todo updated',
                updatedTodo
            })
        }
    }
}))
router.delete('/:id', isAuth, expressAsyncHandler(async (req, res, next) => {
    const todo = await Todo.findOne({
        author: req.user._id,
        _id: req.params.id
    })
    if(!todo){
        res.status(404).json({code: 404, message: 'Todo Not Found'})
    }else{
        await Todo.deleteOne({
            author: req.user._id,
            _id: req.params.id
        })
        res.status(204).json({code: 204, message: 'Todo deleted successful'})
    }
}))

router.get('/group/:field', isAuth, isAdmin, isFieldValid, expressAsyncHandler(async (req, res, next) => {
    const docs = await Todo.aggregate([
        {
            $group: {
                _id: `$${req.params.field}`,
                count: { $sum: 1 }
            }
        },
        { 
            $sort: {_id: 1}
        }
    ])
    console.log(`Number Of Group: ${docs.length}`)
    // docs.sort((d1, d2) => d1._id - d2._id)
    res.json({code: 200, docs})
}))
router.get('/group/mine/:field', isAuth, isFieldValid, expressAsyncHandler(async (req, res, next) => {
    const docs = await Todo.aggregate([
        {
            $match: {author: new ObjectId(req.user._id)}
        },
        {
            $group: {
                _id: `$${req.params.field}`,
                count: {$sum: 1}
            }
        },
        { 
            $sort: {_id: 1}
        }
    ])
    console.log(`Number Of Group: ${docs.length}`)
    // docs.sort((d1, d2) => d1._id - d2._id)
    res.json({code: 200, docs})
}))
router.get('/group/date/:field', isAuth, isAdmin, expressAsyncHandler(async (req, res, next) => {
    if(req.params.field === 'createdAt' ||
        req.params.field === 'lastModifiedAt' ||
        req.params.field === 'finishedAt'
    ){
        const docs = await Todo.aggregate([
            {
                $group: {
                    _id: { year: { $year: `$${req.params.field}` }, month: { $month: `$${req.params.field}` } },
                    count: { $sum: 1 }
                }
            },
            { 
                $sort: {_id: 1}
            }
        ])
        console.log(`Number Of Group: ${docs.length}`)
        // docs.sort((d1, d2) => d1._id.year - d2._id.year).sort((d1, d2) => d1._id.month - d2._id.month)
        res.json({code: 200, docs})
    }else{
        res.status(400).json({code: 400, message: 'You gave wrong field to group documents'})
    }
}))
router.get('/group/mine/date/:field', isAuth, expressAsyncHandler(async (req, res, next) => {
        if(req.params.field === 'createdAt' ||
        req.params.field === 'lastModifiedAt' ||
        req.params.field === 'finishedAt'
    ){
        const docs = await Todo.aggregate([
            {
                $match: {author: new ObjectId(req.user._id)}
            },
            {
                $group: {
                    _id: {year: {$year: `$${req.params.field}`}, month: {$month: `$${req.params.field}`}},
                    count: {$sum: 1}
                }
            },
            { 
                $sort: {_id: 1}
            }
        ])
        console.log(`Number Of Group: ${docs.length}`)
        // docs.sort((d1, d2) => d1._id.year - d2._id.year).sort((d1, d2) => d1._id.month - d2._id.month)
        res.json({code: 200, docs})
    }else{
        res.status(400).json({code: 400, message: 'You gave wrong field to group documents'})
    }
}))

module.exports = router