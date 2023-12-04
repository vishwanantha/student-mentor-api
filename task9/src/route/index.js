import express from 'express'
import router from './mentor.js'
import studentRoutes from './studen.js'

const route = express.Router()

route.use('/',router)
router.use('/',studentRoutes)

export default router