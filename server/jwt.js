const jwt = require('jsonwebtoken')

const token = jwt.sign({ email: 'test@gmail.com'}, '비밀키', { expiresIn: '1s' })
console.log(token)
new Promise((resolve) => {
    setTimeout(resolve, 1000)
}).then(() => {
    const verified = jwt.decode(token, {complete: true})
    console.log(verified)
})