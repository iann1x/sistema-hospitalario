const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.userId) {
        return next();
    }
    res.redirect('/auth/login');
};

const hasRole = (roles) => {
    return (req, res, next) => {
        if (!req.session || !req.session.rol) {
            return res.redirect('/auth/login');
        }
        if (roles.includes(req.session.rol) || req.session.rol === 'Admin') {
            return next();
        }
        res.status(403).send('Acceso denegado: No tienes los permisos necesarios.');
    };
};

module.exports = {
    isAuthenticated,
    hasRole
};
