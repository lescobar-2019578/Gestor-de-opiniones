import express from 'express'
import { 
    validateJwt,
} from '../middlewares/validate-jwt.js';
import {
    test,
    login, 
    updateUser, 
    register,
    changePassword
} from './user.controller.js';

const api = express.Router();

api.get('/test', test)
api.post('/register', register)
api.post('/login', login)
api.put('/update/:id', [validateJwt], updateUser)
api.put('/changePassword/:id', [validateJwt], changePassword)

export default api