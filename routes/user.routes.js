module.exports = function(app) {
    var userController = require('../controllers/user.controller');
    const auth = require('../middlewares/auth');

    app.route('/api/users')
        .post( userController.registration)
        .get(auth.checkAuth, userController.getUsers)
        .put(auth.checkAuth, userController.updateUser);

    app.route('/api/users/:user_id')
        .get(auth.checkAuth, userController.getUserById)
        .delete(auth.checkAuth, userController.deleteUserById)

    app.route('/api/users/login')
        .post(userController.login);

    
}