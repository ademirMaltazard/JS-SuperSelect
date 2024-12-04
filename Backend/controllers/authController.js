const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('..models/userModel');

const register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await userModel.findUserByEmail(email);

        if (userExists) return res.status(400).json({message: 'Email já cadastrado'});

        const passwordHash = await bcrypt.hash(password, 10);
        const userId = await userModel.createUser(name, email, passwordHash);
        
        res.status(201).json({message: 'Usuario cadastrado com sucesso!', userId});
    } catch (error) {
        res.status(500).json({error: error.message});
    };
};

const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await userModel.findUserByEmail(email)
    if (!user) return res.status(400).json({message: 'Usuario ou senha invalido.'});

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) return res.status(400).json({message: 'Usuario ou senha invalido.'});
};




module.exports = register;
