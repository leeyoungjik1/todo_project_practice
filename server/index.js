const express = require('express')
const app = express()
const cors = require('cors')
const logger = require('morgan')
const mongoose = require('mongoose')
const axios = require('axios')
// const todo = require('./src/models/Todo')
// const user = require('./src/models/User')
const usersRouter =  require('./src/routes/users')
const todosRouter = require('./src/routes/todos')
const config = require('./config')

const corsOptions = {
    origin: '*',
    credentials: true
}

mongoose.connect(config.MONGODB_URL)
.then(() => console.log('데이터베이스 연결 성공'))
.catch(e => console.log(`데이터베이스 연결 실패: ${e}`))

app.use(cors(corsOptions))
app.use(express.json())
app.use(logger('tiny'))



app.use('/api/users', usersRouter)
app.use('/api/todos', todosRouter)




app.get('/hello', (req, res) => {
    res.json('서버에서 보낸 응답')
})
app.post('/hello', (req, res) => {
    // console.log(req.body)
    res.json({userId: req.body.userId, email: req.body.email})
})
app.get('/error', (req, res) => {
    throw new Error('서버 에러')
})
app.get('/fetch', async (req, res) => {
    const response = await axios.get('https://jsonplaceholder.typicode.com/todos')
    // console.log(response)
    res.send(response.data)
})


app.use((req, res, next) => {
    res.status(404).send('페이지를 찾을수 없습니다.')
})
app.use((err, req, res, next) => {
    console.log(err.stack)
    res.status(500).send('서버 에러 발생')
})

app.listen(5000, () => {
    console.log('server is running on port 5000...')
})