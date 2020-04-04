/**
 * En este controller están las funciones para usuarios
 */
const db = require('../config/config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
/**
 * Función para ingresar un registro en la tabla user.
 */
const registration = (request, response) => {
    // console.log(request)
    const { name, second_name, email, password } = request.body;
    /**
     * Uso de la librería bcrypt para cifrar la variable password y pasa a llamarse hash.
     */
    bcrypt.hash(password, 10, function(error, hash) {
        if (error) {
            response.status(400).send('Error al encriptar');
        } else {
            // console.log(hash)
            db.pool.query("INSERT INTO users (name, second_name, email, password) VALUES($1, $2, $3, $4)", [ name, second_name, email, hash ], (error, results) => {
                if (error) {
                    response.status(401).send(error.stack);
                } else {
                    response.status(201).send('Registrado');
                }
            });
        }
    });
}
/**
 * Función para obtener registros de tabla users
 */
const getUsers = (request, response) => {
    db.pool.query("SELECT user_id, name, second_name, email, password FROM users", (error, results) => {
        if (error) {
            response.status(401).send(error.stack);
        } else {
            response.status(200).send(results.rows);
        }
    });
}
/**
 * Función para el login.
 */
const login = (request, response) => {

    const { email, password } = request.body;

    db.pool.query("SELECT user_id, name, second_name, email, password FROM users WHERE email = $1", [ email ], (error, results) => {
        if (error) {

            response.status(404).send(error.stack);

        } else {

            if(results.rowCount == 0) {
                response.status(404).send('Usuario no existe.');
            } else {
                const result = results.rows[0];
                if (result && bcrypt.compareSync(password, result.password)) {
                    /**
                     * Creacion del token(tokenData) con la información del usuario que se registró.
                     */
                    var tokenData = {
                        user_id: result.user_id,
                        name: result.name,
                        second_name: result.second_name,
                        email: result.email
                    }
                    /**
                     * Expiración de tokenData.
                     */
                    var token = jwt.sign({ tokenData }, db.secret, {
                        expiresIn: 60 * 60 * 24
                    });
    
                    response.status(200).send({token});
                } else {
                    response.status(403).send('Contraseña incorrecta.');
                }
            }            
        }
    });
}
/**
 * Función para obtener usuario por ID
 */
const getUserById = (request, response) => {
    
    const { user_id } = request.params;

    db.pool.query("SELECT user_id, name, second_name, email, password FROM users WHERE user_id = $1", [ user_id ], (error, results) => {
        if (error) {
            response.status(401).send(error.stack);
        } else {
            response.status(200).send(results.rows);
        }
    });
}
/**
 * Función para actualizar un usuario
 */
const updateUser = (request, response) => {
    
    const { user_id,
            name,
            second_name,
            email } = request.body;

    db.pool.query("UPDATE users SET name=$2, second_name=$3, email=$4 WHERE user_id = $1", [ user_id, name, second_name, email ], (error, results) => {
        if (error) {
            response.status(401).send(error.stack);
        } else {
            response.status(200).send('Actualizado el usuario con id ' + user_id);
        }
    });
}
/**
 * Función para eliminar usuario por ID
 */
const deleteUserById = (request, response) => {
    
    const { user_id } = request.params;

    db.pool.query("DELETE FROM users WHERE user_id = $1", [ user_id ], (error, results) => {
        if (error) {
            response.status(401).send(error.stack);
        } else {
            response.status(200).send('Usuario eliminado');
        }
    });
}


module.exports = {
    registration,
    getUsers,
    login,
    getUserById,
    updateUser,
    deleteUserById
}