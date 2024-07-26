// Dependencias
const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const userRoutes = require('./Routes/UsersRoutes')
const postRoutes = require('./Routes/PostsRoutes')
const cors = require('cors')
const path = require('path')
const bodyParser = require('body-parser')
// Variaveis
const app = express()
const PORT = process.env.PORT
const DATABASE = process.env.DATABASE

// Usos do Express
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use('/posts', express.static(path.join(__dirname, "Public/Images/Posts")))
app.use('/profile', express.static(path.join(__dirname, "Public/Images/Profiles")))

// Rotas
app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)

// Criando servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
  mongoose.connect(DATABASE).then(console.log("MongoDB Conectado")).catch(err => console.log(err))
})