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

const KpediaLinkSchema = new Schema({
    description_line1:
    {
        type: String
    },
    description_line2:
    {
        type: String
    },
    topic:
    {
        type: String
    },
    tags:
    {
        type: String
    },
    link:
    {
        type: String,
        required: true,
        unique: true
    },
    upvote:
    {
        type: Number,
        default: 0
    },
    downvote:
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

const KpediaLink = mongoose.model("KpediaLink", KpediaLinkSchema)


module.exports = { KpediaLink };