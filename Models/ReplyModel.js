const mongoose = require('mongoose')

const Schema = mongoose.Schema

const ReplySchema = new Schema({
  text: {
    type: String,
    required: true,
    maxlength: 280
  },
  targetId: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  likescount: {
    type: Number,
    default: 0
  },
  mentions: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  replies: {
    type: Array,
    default: []
  },
  isEditted: {
    type: Boolean,
    default: false
  }
},
                               {
                                 timestamps: true
                               })


const ReplyModel = mongoose.model("Reply", ReplySchema)

module.exports = ReplyModel