const { body } = require('express-validator')

const isFieldEmpty = (field) => {
    return body(field)
            .not()
            .isEmpty() // not, isEmpty 순서 바꾸면 안됨
            .withMessage(`user ${field} is required`)
            .bail() // bail() 메서드 앞쪽 부분이 false 이면 더 이상 뒷쪽의 데이터검증을 안함
            .trim() // 공백 제거
}

const validateUserName = () => {
    return isFieldEmpty("name")
            .isLength({min: 2, max: 20})
            .withMessage("user name length must be between 2~20 characters")
}

const validateUserEmail = () => {
    return isFieldEmpty("email")
            .isEmail()
            .withMessage("user email is not valid")
}

const validateUserPassword = () => {
    return isFieldEmpty("password")
            .isLength({min: 7})
            .withMessage("password must be more than 7 characters")
            .bail()
            .isLength({max: 15})
            .withMessage("password must be lesser than 15 characters")
            .bail()
            .matches(/[A-Za-z]/)
            .withMessage("password must be at least 1 alphabet")
            .matches(/[0-9]/)
            .withMessage("password must be at least 1 number")
            .matches(/[!@#$%^&*]/)
            .withMessage("password must be at least 1 special character")
            .bail()
            .custom((value, {req}) => req.body.confirmPassword === value) // 입력한 비밀번호가 같은지 재확인
            .withMessage("passwords don't match")
}

const validateTodoTitle = () => {
    return isFieldEmpty("title")
    .isLength({ min: 2, max: 20 }) // 2~20자
    .withMessage("todo title length must be between 2 ~ 20 characters")
}
const validateTodoDescription = () => {
    return isFieldEmpty("description")
    .isLength({ min: 5, max: 100 }) // 5 ~100자
    .withMessage("todo description length must be between 5 ~ 100 characters")
}
const validateTodoCategory = () => {
    return isFieldEmpty("category")
    .isIn(['오락', '공부', '음식', '자기계발', '업무', '패션', '여행'])
    .withMessage('todo category must be one of 오락 | 공부 | 음식 | 자기계발 | 업무 | 패션 | 여행')
}

module.exports = {
    validateUserName,
    validateUserEmail,
    validateUserPassword,
    validateTodoTitle,
    validateTodoDescription,
    validateTodoCategory
}