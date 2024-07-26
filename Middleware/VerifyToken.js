const jwt = require('jsonwebtoken')

const verifyToken = (req,res, next) => {
  const token = req.headers['authorization']
  if (!token) {
    return res.status(404).json({ msg: 'Token não encontrado' })
  }
    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json({ msg: 'Token inválido' })
      }
      req.user = decoded
      next();
    })
}

module.exports = verifyToken