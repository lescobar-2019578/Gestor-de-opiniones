'use strict'

import { Router } from 'express'
import { 
    test, 
    createComment, 
    deleteComment, 
    editComment } from './comment.controller.js'
import {  validateJwt } from '../middlewares/validate-jwt.js'

const api = Router()

api.get('/test', test)
api.post('/create', [validateJwt], createComment)
api.delete('/delete/:id', deleteComment)
api.put('/edit/:id', [validateJwt], editComment)

export default api