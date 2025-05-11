import mongoose from "mongoose";

// Embedded comments modo dinamico
const commentSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const blogPostSchema = new mongoose.Schema({
    category: {type: String, required: true },
    title: {type: String, required: true },
    cover: {type: String, required: true },
    readTime: {
        value: {type: Number, required: true },
        unit: {type: String, required: true}
    },
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'Authors', required: true },
    content: {type: String, required: true },
    comments: [commentSchema] // Embedded comments
}, {
    timestamps: true
})

const blogPostModel = mongoose.model('BlogPost', blogPostSchema);
export default blogPostModel;