import * as mongoose from 'mongoose'

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    commentedBY: String,
    commentDate: {
        type: Date,
        default: Date.now
    },
    comment: String
});

const linkSchema = new Schema({
    topic:String,
    description: String,
    tags : [String],
    link:
    {
        type: String,
        required: true,
        unique: true
    },
    like:
    {
        type: Number,
        default: 0
    },
    dislike:
    {
        type: Number,
        default: 0
    },
    views:
    {
        type: Number,
        default: 0
    },
    comments: [CommentSchema],
    createdDate: {
        type: Date,
        default: Date.now
    },
    modifiedDate:
    {
        type: Date,
        default: Date.now
    },
    createdBy:
    {
        type: String
    }
});

export const linkDbModel = mongoose.model("link", linkSchema);