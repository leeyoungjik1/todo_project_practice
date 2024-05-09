const express = require('express')
const User = require('../models/User')
const expressAsyncHandler = require('express-async-handler')
const { generateToken, isAuth } = require('../../auth')
const { validationResult, oneOf } = require('express-validator')
const {
    validateUserName,
    validateUserEmail,
    validateUserPassword
} = require('../../validator')

const router = express.Router()

router.post('/register', [
    validateUserName(),
    validateUserEmail(),
    validateUserPassword()
], expressAsyncHandler(async (req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        console.log(errors.array())
        res.status(400).json({
            code: 400,
            message: 'Invaild Form data for user',
            error: errors.array()
        })
    }else{
        // console.log(req.body)
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            userId: req.body.userId,
            password: req.body.password
        })
        const newUser = await user.save()
        .then(() => {
            const { name, email, userId, isAdmin, createdAt } = newUser
            res.json({
                code: 200,
                token: generateToken(newUser),
                name, email, userId, isAdmin, createdAt
            })
        })
        .catch(e => {
            if(e.code === 11000){
                res.status(400).json({code: 400, message: '이메일 중복'})
            }
            res.status(400).json({code: 400, message: 'Invalid User Data'})
        })
    }
}))
router.post('/login', [
    validateUserEmail(),
    validateUserPassword()
], expressAsyncHandler(async (req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        console.log(errors.array())
        res.status(400).json({
            code: 400,
            message: 'Invalid Form data for user',
            error: errors.array()
        })
    }else{
        console.log(req.body)
        const loginUser = await User.findOne({
            email: req.body.email,
            password: req.body.password
        })
        if(!loginUser){
            res.status(401).json({code: 401, message: 'Invalid Email or Invalid Password'})
        }else{
            const { name, email, userId, isAdmin, createdAt } = loginUser
            res.json({
                code: 200,
                token: generateToken(loginUser),
                name, email, userId, isAdmin, createdAt
            })
        }
    }
}))
router.post('/logout', (req, res, next) => {
    res.json('로그아웃')
})
router.put('/', oneOf([
    validateUserName(),
    validateUserEmail(),
    validateUserPassword()
], {
    message: 'At least one field of user must be provided'
}), isAuth, expressAsyncHandler(async (req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        console.log(errors.array())
        res.status(400).json({
            code: 400,
            message: 'Invalid Form data for user',
            error: errors.array()
        })
    }else{
        const user = await User.findById(req.user._id)
        if(!user){
            res.status(404).json({code: 404, message: 'User Not Founded'})
        }else{
            user.name = req.body.name || user.name
            user.email = req.body.email || user.email
            user.userId = req.body.userId || user.userId // 폼검증을 안하기 때문에 아이디만 변경할때 오류 발생
            user.password = req.body.password || user.password
            user.lastModifiedAt = new Date()
    
            const updatedUser = await user.save()
            const { name, email, userId, isAdmin, createdAt } = updatedUser
            res.json({
                code: 200,
                token: generateToken(updatedUser),
                name, email, userId, isAdmin, createdAt
            })
        }
    }
}))
router.delete('/', isAuth, expressAsyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.user._id)
    if(!user){
        res.status(404).json({code: 404, message: 'User Not Found'})
    }else{
        res.status(204).json({code: 204, message: 'User deleted successfully'})
    }
}))

module.exports = router