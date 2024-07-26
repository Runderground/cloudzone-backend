// Dependencias
const express = require('express')
const routes = express.Router()
const mongoose = require('mongoose')
const { registerUser, getAllUsers, authUser, deleteUser, setRoleUser, findUserByUsername, VerifyIsAdmin } = require('../Controles/UserControles')
const VerifyToken = require('../Middleware/VerifyToken')
const isAdmin = require('../Middleware/IsAdmin')
const cors = require('cors')

// Rotas publicas
routes.get("/", getAllUsers) // Coletar todos usuários cadastrados
routes.post("/register", registerUser) // Registrar usuário
routes.post("/auth", authUser) // Autenticar usuário
routes.get("/:username", findUserByUsername) // Achar usuário pelo Username


// Rotas privadas ( Necessario cargo admin )
routes.delete("/delete/:id", VerifyToken, isAdmin, deleteUser) // Deletar usuário
routes.patch("/setrole/:id", setRoleUser) // Alterar cargo do usuário

// Rotas Futuras ->

// Nada aqui ainda :P

module.exports = routes