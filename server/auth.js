const config = require('./config')
const jwt = require('jsonwebtoken')

const generateToken = (user) => {
    return jwt.sign({
        _id: user._id,
        name: user.name,
        email: user.email,
        userId: user.userId,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt
    },
    config.JWT_SECRET,
    {
        expiresIn: '1d',
        issuer: 'sunrise'
    }
    )
}
const isAuth = (req, res, next) => {
    const bearerToken = req.headers.authorization
    if(!bearerToken){
        return res.status(401).json({message: 'Token is not supplied'})
    }else{
        const token = bearerToken.slice(7, bearerToken.length)
        jwt.verify(token, config.JWT_SECRET, (err, userInfo) => {
            if(err && err.name === 'TokenExpiredError'){
                return res.status(419).json({code: 419, message: 'token expired'})
            }else if(err){
                return res.status(401).json({code: 401, message: 'Invalid Token'})
            }
            req.user = userInfo
            next()
        })
    }
}
const isAdmin = (req, res, next) => {
    if(req.user && req.user.isAdmin){
        next()
    }else{
        res.status(401).json({code: 401, message: 'You are not valid admin user'})
    }
}

module.exports = {
    generateToken,
    isAuth,
    isAdmin
}