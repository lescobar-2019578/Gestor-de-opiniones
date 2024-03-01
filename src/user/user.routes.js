import express from 'express'
import { 
    validateJwt,
} from '../middlewares/validate-jwt.js';
import {
    test,
    login, 
    updateUser, 
    register
} from './user.controller.js';

const api = express.Router();

api.post('/register', register)
api.post('/login', login)
api.get('/test', test)
api.put('/update/:id', [validateJwt], updateUser)

export default api