'use strict';

import Comment from './comment.model.js';


export const test = (req, res) => {
    console.log('test is running');
    return res.send({ message: 'Test is running' });
};

// Controlador para crear un nuevo comentario
export const createComment = async (req, res) => {
    try {
        let { comment, text } = req.body;
        let user = req.user._id; // Se asume que el usuario se encuentra autenticado y su ID está disponible en req.user

        let newComment = await Comment.create({ user, comment, text });
        res.status(201).send({ message: 'Comment created successfully', comment: newComment });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Error creating comment' });
    }
};

// Controlador para editar un comentario existente
export const editComment = async (req, res) => {
    try {
        let commentId = req.params.id;
        let { text } = req.body;

        let comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).send({ message: 'Comment not found' });
        }

        // Verificar si el usuario es el autor del comentario
        if (comment.user.toString() !== req.user._id.toString()) {
            return res.status(403).send({ message: 'You do not have permission to edit this comment' });
        }

        comment.text = text;
        await comment.save();

        res.send({ message: 'Comment edited successfully', comment });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Error editing comment'});
    }
};

// Controlador para eliminar un comentario
export const deleteComment = async (req, res) => {
    try {
        let { id } = req.params
        let uid = req.user._id
 
 
        // Verificar si la publicación existe y si el usuario es el propietario
        let comment = await Comment.findOne({ _id: id, user: uid });
        if (!comment)
            return res.status(404).send({ message: 'Comment not found or you are not authorized to delete it' });
 
        // Eliminar la comentario
        let deletedComment = await Comment.findOneAndDelete({ _id: id, user: uid });
        if (!deletedComment)
            return res.status(500).send({ message: 'Error deleting comment' });
 
        return res.send({ message: 'Comment deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error deleting comment' });
    }
};
