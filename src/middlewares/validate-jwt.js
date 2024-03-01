'use strict';

import jwt from 'jsonwebtoken';
import User from '../user/user.model.js';

export const validateJwt = async (req, res, next) => {
    try {
        // Obtener la clave secreta para decodificar el token
        let secretKey = process.env.SECRET_KEY;
        // Extraer el token de los encabezados
        let { token } = req.headers;
        // Verificar la existencia del token
        if (!token) return res.status(401).send({ message: 'No autorizado' });
        // Decodificar el token y obtener el ID de usuario
        let { uid } = jwt.verify(token, secretKey);
        // Validar la existencia del usuario en la base de datos
        let user = await User.findOne({ _id: uid });
        if (!user) return res.status(404).send({ message: 'Usuario no encontrado - No autorizado' });
        req.user = user;
        next();
    } catch (err) {
        console.error(err);
        return res.status(401).send({ message: 'Token inválido' });
    }
};

