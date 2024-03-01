import express from 'express'
import { 
    validateJwt,
} from '../middlewares/validate-jwt.js';
import {
    test,
    savePost,
    updatePost,
    deletePost
} from './post.controller.js';

const api = express.Router();

api.post('/save', savePost)
api.get('/test', test)
api.put('/updatePost/:id', [validateJwt], updatePost)
api.delete('/deletePost/:id', [validateJwt], deletePost)

export default api