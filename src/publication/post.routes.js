import express from 'express'
import { 
    validateJwt,
} from '../middlewares/validate-jwt.js';
import {
    test,
    savePost,
    updatePost,
    deletePost,
    getPost
} from './post.controller.js';

const api = express.Router();

api.post('/save',[validateJwt], savePost)
api.get('/test', test)
api.put('/updatePost/:id', [validateJwt], updatePost)
api.delete('/deletePost/:id', [validateJwt], deletePost)
api.post('/getPost/:id', [validateJwt], getPost)
export default api