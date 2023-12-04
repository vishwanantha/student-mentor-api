import express from "express"

import studentuser from "../user/student.js"

const router = express.Router()

router.post('/usess',studentuser.createStudent)
router.post('/uss',studentuser.assignChangeMentor)
router.get('/contr',studentuser.getPreviousMentor)

export default router