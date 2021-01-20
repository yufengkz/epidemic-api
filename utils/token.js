import jwt from 'jsonwebtoken'
const util = require('util')
const verify = util.promisify(jwt.verify)
import config from '../config'

export const createToken = async info => {
    // info 用户信息
    const token = await jwt.sign(info, config.TOKEN_KEY, {
        expiresIn: config.TOKEN_EXPIRESIN
    })
    return token
}

const decodeTokens = async ctx => {
    const token = ctx.header.token
    if (!token) {
        ctx.status = 200
        ctx.body = {
            code: 1,
            msg: '您没有权限操作'
        }
        return
    }
    try {
        const user = await verify(token, config.TOKEN_KEY)
        return user
    } catch (error) {
        return error
    }
}
export const decodeToken = decodeTokens

export const checkAuth = async ctx => {
    const user = await decodeTokens(ctx)
    if (user && user.username) {
        return true
    } else {
        ctx.status = 200
        ctx.body = { code: 1, message: '您无权限进行此操作' }
        return false
    }
}
