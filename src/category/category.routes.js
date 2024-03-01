import express from 'express'


import {
    testCategory,
    getAllCategories, 
    getCategoryById, 
    createCategory, 
    updateCategory,
    deleteCategory
} from './category.controller.js';
import { validateJwt } from '../middlewares/validate-jwt.js';


const api = express.Router();

//Rutas publicas 
api.get('/getAllCategories', getAllCategories)
api.get('/getCategory/:id', getCategoryById)

// Rutas privadas protegidas por middleware 
api.get( '/test', [validateJwt],testCategory); //prueba de conexion al servidor
api.post('/createCategory', [validateJwt], createCategory)
api.put('/updateCategory/:id',[validateJwt],updateCategory)
api.delete('/deleteCategory/:id',[validateJwt],deleteCategory)



export default api