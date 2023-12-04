import express from "express"

import allstudenMentor from "../user/mentor.js"

const router = express.Router()


router.post('/',allstudenMentor.createMentor)
router.post('/uses',allstudenMentor.assignStudents)
router.get('/usess',allstudenMentor.allStudentsofParticularMentor)

export default router