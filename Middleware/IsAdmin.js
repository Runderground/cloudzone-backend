const isAdmin = (req, res, next) => {
  if(req.user.roles !== "admin") {
    res.status(401).json({error: "Cargo de administrador requirido!"})
  }

  next()
}

module.exports = isAdmin