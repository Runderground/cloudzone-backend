// Dependencias
const express = require('express')
const routes = express.Router()
const { getAllPosts, createPost, likePost, getPostById, CommentInPost, devReplyGetAll, getAllReplies} = require('../Controles/PostControles')
const { Postupload } = require('../Config/Multer')
const VerifyToken = require('../Middleware/VerifyToken')
const isAdmin = require('../Middleware/IsAdmin')
const fs = require('fs')
const path = require('path')
const baseURL =
  "https://b2c980b6-2b44-4b66-896d-8474a0a41bc7-00-1m6l13xxgg2ud.janeway.replit.dev:3001/api/";

// Rotas publicas
routes.get("/", getAllPosts) // Coletar todos os posts cadastrados

routes.get("/:postId", getPostById) // Achar post pelo ID

routes.get("/replies/:postId", getAllReplies) // Retornar todos os comentários/respostas de um post

routes.post("/createpost", VerifyToken, Postupload.array('files'), createPost ) // Criar um novo post

routes.post("/comentar/:postid", VerifyToken, CommentInPost) // Comentar em um post

routes.patch("/like/:postid/:userid", VerifyToken, likePost) // Funcionalidade de dar/cancelar a curtida de um post



// Rotas privadas ( Necessario cargo admin )

// Rotas para desenvolvimento ( Remover em produção! )
routes.get("/getreplys/all", devReplyGetAll)

// Nada aqui ainda :P

module.exports = routes

//https://b2c980b6-2b44-4b66-896d-8474a0a41bc7-00-1m6l13xxgg2ud.janeway.replit.dev:3001/api/posts/comentar/