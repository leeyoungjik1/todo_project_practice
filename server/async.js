
const asyncFunction = () => {
  return new Promise(resolve => {
    setTimeout(_ => {
      resolve({ message: 'success' })
    }, 3000);
  })
}

const wrap = (asyncFn) => {
    return (async (req, res, next) => {
        try {
            await asyncFn()
            throw new Error('사용자 정의 에러 발생')
            return res.json('해결')
        } catch (error) {
            return next(error)
        }
    })  
}

module.exports = {
    wrap,
    asyncFunction
}