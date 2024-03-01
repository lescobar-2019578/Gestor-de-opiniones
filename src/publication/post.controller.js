'use strict'
import Post from './post.model.js'
import Category from '../category/category.model.js'
import Opinion from '../comment/comment.model.js'
import { checkUpdate } from '../utils/validator.js'


export const test = (req, res) => {
    console.log('test is running')
    return res.send({ message: 'Test is running' })
}

// Controlador para crear una nueva publicación
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

// Controlador para editar una publicación
export const updatePost = async (req, res) => {
    try {
        let { id } = req.params
        let data = req.body
        let update = checkUpdate(data, false)
        let userToken = req.user._id.toString()

        let post = await Post.findOne({ _id: id })
        if (!post) {
            return res.status(404).send({ message: 'Post not found' })
        }
        
        //Compara si el usuario que esta enviando la solicitud es el mismo del comentario
        if (post.user.toString() !== userToken) {
            return res.status(403).send({ message: 'Unauthorized to delete this post' })
        }

        if (!update) {
            return res.status(400).send({ message: 'Have submitted some data that cannot be updated or missing data' })
        }
        
        let updatePost = await Post.findOneAndUpdate(
            { _id: id },
            data,
            { new: true }
        ).populate('category', ['name', 'description'])
        if (!updatePost) return res.status(404).send({ message: 'Publi not found and not updated' })
        return res.send({ message: 'Post updated successfully', updatePost })
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error updating psot'});
    }
};

// Controlador para eliminar una publicación
export const deletePost = async (req, res) => {
    try {
        let { id } = req.params
        let userToken  = req.user._id.toString();

        let post = await Post.findOne({_id : id})
        if (!post) {
            return res.status(404).send({ message: 'The post not found' })
        }

        // Verificar si el usuario es el autor de la publicación
        if (post.user.toString() !== userToken) {
            return res.status(403).send({ message: 'Unautorized  to delete the post' });
        }
        await Opinion.remove({ post: id})

        let deletedPost = await Post.deleteOne({ _id: id })
            if (deletedPost.deletedCount === 0) return res.status(404).send({ message: 'Post not found and not deleted' })
        return res.send({ message: 'The post deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'ERROR deleting post', error: err.message });
    }
};

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