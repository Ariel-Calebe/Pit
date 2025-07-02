const fs = require('fs');
const path = require('path');
const usersFilePath = path.join(__dirname, '../data/users.json');

// Função de login
exports.login = (req, res) => {
    const { email, password } = req.body;

    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Erro no servidor');
        
        const users = JSON.parse(data);
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            res.status(200).json({ message: 'Login bem-sucedido!' });
        } else {
            res.status(404).json({ message: 'Usuário não encontrado!' });
        }
    });
};

// Função de cadastro
exports.register = (req, res) => {
    const { email, password } = req.body;

    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Erro no servidor');

        const users = JSON.parse(data);
        const existingUser = users.find(u => u.email === email);

        if (existingUser) {
            return res.status(400).json({ message: 'Email já está em uso!' });
        }

        const newUser = { email, password };
        users.push(newUser);

        fs.writeFile(usersFilePath, JSON.stringify(users), 'utf8', (err) => {
            if (err) return res.status(500).send('Erro ao salvar o usuário');

            res.status(201).json({ message: 'Usuário registrado com sucesso!' });
        });
    });
};
