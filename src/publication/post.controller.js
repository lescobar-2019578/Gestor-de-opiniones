'use strict'
import Post from './post.model.js'
import Category from '../category/category.model.js'
import Opinion from '../comment/comment.model.js'
import { checkUpdate } from '../utils/validator.js'


export const test = (req, res) => {
    console.log('test is running')
    return res.send({ message: 'Test is running' })
}

// Controlador para crear una nueva post
export const savePost = async (req, res) => {
    try {
        let data = req.body
        data.user = req.user._id
        let category = await Category.findOne({ _id: data.category })
        if (!category) {
            return res.status(404).send({ message: 'Category not found' })
        }
        
        let post = new Post (data)
        await post.save()

        return res.send({ message: 'Post saved successfully' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error saving post' })
    }
};

// Update de la post
export const updatePost = async (req, res) => {
    try {
        let { id } = req.params;
        let data = req.body;

        let update = checkUpdate(data, id);
        if (!update) 
            return res.status(400).send({ message: 'Se ha enviado algún dato que no se puede actualizar o falta algún dato' });

        let post = await Post.findOne(
            { _id: id},data
        );

        if (!post) 
            return res.status(404).send({ message: 'Post no encontrada o no estás autorizado para actualizarla' });

        let updatedPost = await Post.findOneAndUpdate(
            { _id: id }, 
            data, 
            { new: true }
        );

        if (!updatedPost) 
            return res.status(401).send({ message: 'La post no se encontró o no se actualizó' });

        return res.send({ message: 'Post actualizada', updatedPost });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error al actualizar la post' });
    }
}


// Controlador para eliminar una post
export const deletePost = async (req, res) => {
    try {
        let { id } = req.params;
        let uid = req.user._id
 
 
        // Verificar si la post existe y si el usuario es el propietario
        let post = await Post.findOne({ _id: id, user: uid });
        if (!post)
            return res.status(404).send({ message: 'Post not found or you are not authorized' });
 
        // Eliminar la post
        let deletedPost = await Post.findOneAndDelete({ _id: id, user: uid });
        if (!deletedPost)
            return res.status(500).send({ message: 'Error deleting post' });
 
        return res.send({ message: 'Post deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error deleting post' });
    }
}

export const getPost = async(req, res) => {
    try {
        let {id} = req.params
        let post = await Post.findOne(id)

        if (!post) 
        return res.status(404).send({ message: 'The Post not found' })

        let opinions = await Opinion.find({ post: id });

        return res.send({post, opinions})
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'ERROR Could not search for the post'});
    }
}