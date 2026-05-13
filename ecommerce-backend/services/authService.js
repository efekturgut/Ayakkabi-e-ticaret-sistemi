const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authRepository = require("../repositories/authRepository");

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    }
  );
};

const register = async ({ name, email, password }) => {
  if (!name || !email || !password) {
    const error = new Error("name, email ve password zorunludur");
    error.statusCode = 400;
    throw error;
  }

  const existingUser = await authRepository.findUserByEmail(email);

  if (existingUser) {
    const error = new Error("Bu email ile kayıtlı kullanıcı zaten var");
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await authRepository.createUser({
    name,
    email,
    hashedPassword,
  });

  const token = generateToken(user);

  return {
    user,
    token,
  };
};

const login = async ({ email, password }) => {
  if (!email || !password) {
    const error = new Error("email ve password zorunludur");
    error.statusCode = 400;
    throw error;
  }

  const user = await authRepository.findUserByEmail(email);

  if (!user) {
    const error = new Error("Email veya şifre hatalı");
    error.statusCode = 401;
    throw error;
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    const error = new Error("Email veya şifre hatalı");
    error.statusCode = 401;
    throw error;
  }

  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.created_at,
  };

  const token = generateToken(safeUser);

  return {
    user: safeUser,
    token,
  };
};

const getProfile = async (userId) => {
  const user = await authRepository.findUserById(userId);

  if (!user) {
    const error = new Error("Kullanıcı bulunamadı");
    error.statusCode = 404;
    throw error;
  }

  return user;
};

module.exports = {
  register,
  login,
  getProfile,
};