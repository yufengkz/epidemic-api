import Router from 'koa-router'

// 引入路由
import DataBaseController from '../controllers/database'

// router前缀
const router = new Router({
    prefix: '/api'
})
// 获取token
router.post('/getToken', DataBaseController.getToken)

// 创建数据
router.post('/create', DataBaseController.create)
// 请求查询数据
router.post('/search', DataBaseController.search)
// 出发城市列表数据
router.post('/startcity', DataBaseController.startCity)
// 到达城市列表数据
router.post('/endcity', DataBaseController.endCity)

export default router
