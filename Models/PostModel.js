const mongoose = require('mongoose')

const Schema = mongoose.Schema

const PostSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    maxlength: 280
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
  images: {
    type: Array,
    validate: [arrayLimit, 'Limite de imagens excedido'],
    default: []
  },
  isEditted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
})

function arrayLimit(val) {
  return val.length <= 4;
}

const Post = mongoose.model('Post', PostSchema)

module.exports = Post