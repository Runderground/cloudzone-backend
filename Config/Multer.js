const multer = require("multer");

// Storage para salvar as imagens dos Posts
const Poststorage = multer.diskStorage({
  destination: function(req, file, cb) {
    return cb(null, "./Public/Images/Posts")
  },
  filename: function(req, file, cb) {
    return cb(null, `${Date.now()}-${file.originalname}`)
  }
})

// Função para dar upload em imagens
const Postupload = multer({
  storage: Poststorage,
  limits: { fileSize: 1024 * 1024 * 5},  
  fileFilter: (req, file, cb) => {
    const allowedFileTypes = ['image/jpg', 'image/jpeg', 'image/png']
    if(allowedFileTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(null, false)
    }
  }
})

module.exports = { Postupload }