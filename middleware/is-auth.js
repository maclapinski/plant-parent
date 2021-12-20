module.exports = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        req.flash('error', 'Log-in or Sign-up to get access to all features.');
        return res.redirect('/login');
    }
    next();
}