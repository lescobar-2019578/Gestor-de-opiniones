'use strict'

import { Router } from 'express'
import { 
    testCom, 
    createComment, 
    deleteComment, 
    editComment } from './comment.controller.js'
import {  validateJwt } from '../middlewares/validate-jwt.js'

const api = Router()

api.get('/test', testCom)
api.post('/create', [validateJwt], createComment)
api.delete('/delete/:id', [validateJwt], deleteComment)
api.put('/edit/:id', [validateJwt], editComment)

export default api