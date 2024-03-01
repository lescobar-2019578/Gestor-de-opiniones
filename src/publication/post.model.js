import { Schema, model } from "mongoose"

const postSchema = Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    text: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

export default model('Post', postSchema)