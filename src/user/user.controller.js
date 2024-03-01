'use strict';

import User from './user.model.js'
import { encrypt, checkPassword, checkUpdate } from '../utils/validator.js'
import { generateJwt } from '../utils/jwt.js'

export const test = (req, res) => {
    console.log('test is running')
    return res.send({ message: 'Test is running' })
};

export const register = async (req, res) => {
    try {
        let data = req.body;

        data.password = await encrypt(data.password);

        data.role = 'USER'; // Cambiado a 'USER' en lugar de 'ADMIN' por defecto

        let user = new User(data);
        await user.save();

        return res.send({ message: `Registered user successfully. You can log in with username: ${user.username}` });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error registering user', err: err });
    }
};

export const login = async (req, res) => {
    try {
        let data = req.body;

        let login = await User.findOne({
            $or: [
                { username: data.username },
                { email: data.email }
            ]
        });

        if (!login) return res.status(404).send({ message: 'Username or email not found' });

        if (await checkPassword(data.password, login.password)) {
            let loggedUser = {
                uid: login._id,
                email: login.email,
                name: login.name
            };

            let token = await generateJwt(loggedUser);
            return res.send({ message: `Welcome ${loggedUser.name}`, loggedUser, token });
        } else {
            return res.status(401).send({ message: 'Invalid password' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error logging in user', error: error });
    }
};

export const updateUser = async (req, res) => {
    try {
        let { id } = req.params;
        let data = req.body;

        let update = checkUpdate(data, id);
        if (!update) return res.status(400).send({ message: 'Some data cannot be updated or missing' });

        let updatedUser = await User.findOneAndUpdate(
            { _id: id },
            data,
            { new: true }
        );

        if (!updatedUser) return res.status(401).send({ message: 'User not found or not updated' });

        return res.send({ message: 'Updated user', updatedUser });
    } catch (err) {
        console.error(err);
        if (err.keyValue && err.keyValue.username) return res.status(400).send({ message: `Username ${err.keyValue.username} is already taken` });
        return res.status(500).send({ message: 'Error updating account', error: err });
    }
};

export const changePassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { oldPassword, newPassword } = req.body;

        const user = await User.findById(id);
        if (!user) return res.status(404).send({ message: 'User not found' });

        const isPasswordValid = await checkPassword(oldPassword, user.password);
        if (!isPasswordValid) return res.status(401).send({ message: 'Invalid old password' });

        user.password = await encrypt(newPassword);
        await user.save();

        return res.send({ message: 'Password updated successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error changing password', error: err });
    }
};

export const getUserProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).select('-password');
        if (!user) return res.status(404).send({ message: 'User not found' });
        return res.send({ userProfile: user });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error fetching user profile', error: err });
    }
};
