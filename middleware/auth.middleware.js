const authMiddleware = async (req, res, next) => {
    const { username } = req.session;

    if (username) {
        return next();
    }

    res.redirect("/login");
};

module.exports = authMiddleware;
