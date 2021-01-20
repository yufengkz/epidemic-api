import { readFile } from '../utils'
import { createToken, checkAuth } from '../utils/token'

const user = {
    id: 1,
    username: 'admin',
    password: '123456'
}

let database
class DatabaseController {
    // 创建数据
    static async create(ctx) {
        let data = ctx.request.body
        // token
        const { token } = ctx.request.header
        // 验证权限
        const isAuth = await checkAuth(ctx)
        if (!token || !isAuth) {
            ctx.response.status = 200
            ctx.body = {
                code: 1,
                message: '请求不合法'
            }
            return
        }
        try {
            database = data
            ctx.response.status = 200
            ctx.body = {
                code: 0,
                message: '数据同步成功'
            }
        } catch (err) {
            ctx.response.status = 200
            ctx.body = {
                code: 1,
                message: `数据同步失败`,
                data: err
            }
        }
    }

    // 返回查询数据
    static async search(ctx) {
        const { start_city, start_end } = ctx.request.body
        try {
            // database
            if (start_city && start_end) {
                let data = database.filter(item => {
                    if (item.start_city === start_city && item.start_end === start_end) {
                        return item
                    }
                })
                ctx.response.status = 200
                ctx.body = {
                    data,
                    code: 0,
                    message: `数据请求成功`
                }
            } else if (start_city && !start_end) {
                let data = database.filter(item => {
                    if (item.start_city === start_city) {
                        return item
                    }
                })
                ctx.response.status = 200
                ctx.body = {
                    data,
                    code: 0,
                    message: `数据请求成功`
                }
            } else {
                ctx.response.status = 200
                ctx.body = {
                    data: [],
                    code: 0,
                    message: '没有查到数据'
                }
            }
        } catch (error) {
            ctx.response.status = 200
            ctx.body = {
                data: [],
                code: 0,
                message: '失败了'
            }
        }
    }
    // 返回出发城市数据
    static async startCity(ctx) {
        try {
            const data = await readFile('/data/start_citycode.json')
            ctx.response.status = 200
            ctx.body = {
                data,
                code: 0,
                message: '读取城市列表数据成功'
            }
        } catch (err) {
            ctx.response.status = 200
            ctx.body = {
                code: 1,
                message: `读取城市列表失败`,
                data: err
            }
        }
    }
    // 返回到达城市数据
    static async endCity(ctx) {
        try {
            const data = await readFile('/data/end_citycode.json')
            ctx.response.status = 200
            ctx.body = {
                data,
                code: 0,
                message: '读取城市列表数据成功'
            }
        } catch (err) {
            ctx.response.status = 200
            ctx.body = {
                code: 1,
                message: `读取城市列表失败`,
                data: err
            }
        }
    }
    // 模拟创建用户登录
    static async getToken(ctx) {
        const { username, password } = ctx.request.body
        if (username === user.username && password === user.password) {
            //生成token
            const userToken = { id: user.id, username: user.username }
            const token = await createToken(userToken)
            ctx.response.status = 200
            ctx.body = {
                data: { token },
                code: 0,
                message: '获取token成功'
            }
        } else {
            ctx.response.status = 200
            ctx.body = {
                data: {},
                code: 1,
                message: '获取token失败'
            }
        }
    }
}

export default DatabaseController
