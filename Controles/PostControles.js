const PostModel = require("../Models/PostModel");
const UserModel = require("../Models/UserModel");
const ReplyModel = require("../Models/ReplyModel");
const jwt = require("jsonwebtoken");

// Função para pegar o ID do usuário através do Token
function getUserIdFromToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    return decoded._id;
  } catch (err) {
    return null;
  }
}

// Função de criar um post novo
const createPost = async (req, res) => {
  try {
    // Analisar se o texto contém alguma menção
    let mentionRegex = /@(\w+)/g;
    let mentions = [];
    let match;
    while ((match = mentionRegex.exec(req.body.text)) !== null) {
      const username = match[1]; // Obter o nome de usuário após o "@"
      // Verificar se o nome de usuário existe no banco de dados
      const user = await UserModel.findOne({ username: username });
      if (user) {
        mentions.push(user._id);
      }
    }

    // Pegar ID do autor do post.
    const token = req.headers.authorization;
    const authorId = getUserIdFromToken(token);

    // Criar um novo post com os dados fornecidos
    const { text } = req.body;
    const images = req.files;

    let postImages = images || [];
    if (postImages.length > 0) {
    }
    if (postImages.length > 4)
      return res.json({ error: "Não é possível enviar mais de 4 imagens!" });
    const newPost = new PostModel({
      text,
      author: authorId,
      likes: [],
      mentions,
      images: postImages,
      replies: [],
    });
    await newPost.save();
    return res.json(newPost);
  } catch (err) {
    console.log(err);
  }
};

// Funcionalidade para curtir algum post
const likePost = async (req, res) => {
  try {
    const { postid, userid } = req.params;

    const post = await PostModel.findById(postid);
    const user = await UserModel.findById(userid);

    if (!user) {
      return res
        .status(404)
        .json({ error: "Usuário não existe ou encontrado" });
    }

    if (!post) {
      return res.status(404).json({ error: "Post não existe ou encontrado" });
    }

    if (post.likes.includes(userid)) {
      const index = post.likes.indexOf(userid);
      post.likes.splice(index, 1);
      post.likescount = post.likes.length
      await post.save();
      return res.json(post);
    }

    post.likes.push(userid);
    post.likescount = post.likes.length
    await post.save();
    return res.json(post);
  } catch (err) {
    console.log(err);
  }
};

// Pegar todos os posts
const getAllPosts = async (req, res) => {
  const posts = await PostModel.find()
    .populate("author", "name username profilePicture _id")
  if (!posts) return res.json({ error: "Nenhum post encontrado!" });
  return res.json(posts);
};

// Pegar post pelo ID
const getPostById = async(req,res) => {
  const {postId} = req.params
  const post = await PostModel.findById(postId).populate("author", "name username profilePicture _id")
  if(!post) return res.json({error: "Post não encontrado ou não existe..."})
  return res.json(post)
}

// Comentar em algum post
const CommentInPost = async(req,res) => {
  try{
  const { postid } = req.params
  const { text } = req.body

    // Analisar se o texto contém alguma menção
    let mentionRegex = /@(\w+)/g;
    let mentions = [];
    let match;
    while ((match = mentionRegex.exec(req.body.text)) !== null) {
      const username = match[1]; // Obter o nome de usuário após o "@"
      // Verificar se o nome de usuário existe no banco de dados
      const user = await UserModel.findOne({ username: username });
      if (user) {
        mentions.push(user._id);
      }
    }
    
  // Pegar ID do autor do post.
  const token = req.headers.authorization;
  const authorId = await getUserIdFromToken(token);
  const post = await PostModel.findById(postid)
  if(!post) return res.json({error: "Post não encontrado ou não existe..."})
  const newReply = new ReplyModel({
    text,
    targetId: postid,
    likes: [],
    author: authorId,
    mentions: mentions,
    replies: [],
  })
    await newReply.save()
    const ReplyPush = await ReplyModel.find({targetId: post._id})
    post.replies.push(ReplyPush._id)
    await post.save()
    const returnPost = await ReplyModel.findById(newReply._id).populate("author", "name username profilePicture _id roles")
    return res.json(returnPost)
  } catch(err) {
    console.error(err)
  }
}

const getAllReplies = async (req,res) => {
  const {postId} = req.params
  const post = await ReplyModel.find({targetId: postId}).populate('author', 'username name profilePicture roles')
  if(!post) return res.json({error: "Não há comentários para esse post..."})
  return res.json(post)
}

const devReplyGetAll = async (req,res) => {
  const reply = await ReplyModel.find()
  if(!reply) return res.status(404).json("Erro ao tentar achar os Replys")
  res.json(reply)
}

module.exports = { getAllPosts, createPost, likePost, getPostById, CommentInPost, devReplyGetAll, getAllReplies};

//https://b2c980b6-2b44-4b66-896d-8474a0a41bc7-00-1m6l13xxgg2ud.janeway.replit.dev:3001/api/posts/like/668fefe299c23b3cce25afd8/6697dd87115922ee257d45c6
