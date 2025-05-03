const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

class UserController {
    static async register(req, res) {
        try {
            const { username, password } = req.body;
            await User.create(username, password);
            res.status(201).json({ message: 'User created successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async login(req, res) {
        try {
            const { username, password } = req.body;
            const user = await User.findByUsername(username);

            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const token = jwt.sign(
                { userId: user.id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.json({
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    role: user.role
                }
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async createUser(req, res) {
        try {
            // Verify admin role
            if (req.user.role !== 'admin') {
                return res.status(403).json({ error: 'Only administrators can create users' });
            }

            const { username, password, role } = req.body;

            // Validate role
            if (role !== 'admin' && role !== 'user') {
                return res.status(400).json({ error: 'Role must be either "admin" or "user"' });
            }

            // Create user with specified role
            await User.createWithRole(username, password, role);
            res.status(201).json({ message: 'User created successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getAllUsers(req, res) {
        try {
            if (req.user.role !== 'admin') {
                return res.status(403).json({ error: 'Only administrators can view all users' });
            }

            const users = await User.getAllUsers();
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = UserController;