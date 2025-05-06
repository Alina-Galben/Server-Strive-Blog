import mongoose from "mongoose";

const blogPostSchema = new mongoose.Schema({
    category: {type: String, required: true },
    title: {type: String, required: true },
    cover: {type: String, required: true },
    readTime: {
        value: {type: Number, required: true },
        unit: {type: String, required: true}
    },
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'authorSchema', required: true },
    content: {type: String, required: true }
}, {
    timestamps: true
})

const blogPostModel = mongoose.model('BlogPost', blogPostSchema);
export default blogPostModel;