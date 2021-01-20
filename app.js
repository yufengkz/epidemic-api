import Koa from 'koa'
import views from 'koa-views'
import json from 'koa-json'
import onerror from 'koa-onerror'
import koaBody from 'koa-body'
import bodyparser from 'koa-bodyparser'
import logger from 'koa-logger'

//引入配置文件
import config from './config'

//引入router controller(所有router)
import index from './routes/index'

const app = new Koa()
console.log(`---------------------------------------`)
console.log(` 服务运行在-${config.PORT}，当前环境-${config.env}`)
console.log(`---------------------------------------`)

// error handler
onerror(app)

// middlewares
// 解除数据传输量太大
app.use(
    koaBody({
        multipart: true,
        formLimit: '100mb',
        jsonLimit: '100mb'
    })
)
app.use(
    bodyparser({
        enableTypes: ['json', 'form', 'text'],
        formLimit: '100mb',
        jsonLimit: '100mb'
    })
)
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(
    views(__dirname + '/views', {
        extension: 'ejs'
    })
)

// logger
app.use(async (ctx, next) => {
    const start = new Date()
    await next()
    const ms = new Date() - start
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
    console.error('server error', err, ctx)
})

//运行服务
app.listen(config.PORT, config.HOST)

module.exports = app
