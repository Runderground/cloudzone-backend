const validator = require("validator");
const UserModel = require("../Models/UserModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const CreateToken = (_id, roles) => {
  const token = jwt.sign({ _id, roles }, process.env.JWT_KEY, {
    expiresIn: "3d",
  });
  return token;
};

const registerUser = async (req, res) => {
  const { name, username, email, password } = req.body;
  const usernamelower = await username.toLowerCase();
  try {
    if (!name || !username || !email || !password) {
      return res.json({ error: "Preencha todos os campos!" });
    }
    if(usernamelower.length < 3) return res.json({error: "Username inválido!"})
    const isEmailValid = validator.isEmail(email);
    if (!isEmailValid) {
      return res.json({ error: "Insira um email válido!" });
    }
    if (password.length < 8) {
      return res.json({ error: "A senha deve ter no mínimo 8 caracteres!" });
    }
    const isUserExists = await UserModel.findOne({ username: usernamelower });
    if (isUserExists) {
      return res.json({ error: "Usuário já existe!" });
    }
    const isEmailExists = await UserModel.findOne({ email });
    if (isEmailExists) {
      return res.json({ error: "Email ja está sendo utilizado!" });
    }
    const salt = await bcrypt.genSalt(10);
    const PassHash = await bcrypt.hash(password, salt);

    const user = new UserModel({
      name: name,
      username: usernamelower,
      email: email,
      password: PassHash,
    });
    await user.save();
    const token = CreateToken(user._id, user.roles);

    return res.json({
      id: user._id,
      name,
      username: user.username,
      email,
      token,
    });
  } catch (err) {
    console.log(err);
  }
};

const authUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      res.json({ error: "Email ou senha inválidos!" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.json({ error: "Email ou senha inválidos!" });
    }
    const token = CreateToken(user._id, user.roles);
    return res.json({
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      token,
    });
  } catch (err) {
    console.log(err);
  }
};

const getAllUsers = async (req, res) => {
  const users = await UserModel.find();
  return res.json(users);
};

const deleteUser = async(req,res) => {
  const {id} = req.params;
  try {
    const user = await UserModel.findByIdAndDelete(id);
    if (!user) {
      return res.json({error: "Usuário não encontrado!"});
    }
    return res.json("Usuário deletado com sucesso!");
  } catch (err) {
    console.log(err);
  }
}

const setRoleUser = async(req,res) => {
  const { id } = req.params
  const user = await UserModel.findByIdAndUpdate(id, { roles: req.body.roles })
  if(!user) return res.json({error: "Usuário não encontrado!"})
  return res.json("Cargo do usuário alterado com sucesso!")
}

const findUserByUsername = async(req,res) => {
  const username = await req.params.username.toLowerCase()
  const user = await UserModel.findOne({ username }).select("-password")
  if(!user) return res.json({error: "Usuário não encontrado!"})
  return res.json({success: user})
}

module.exports = { registerUser, getAllUsers, authUser, deleteUser, setRoleUser, findUserByUsername };
