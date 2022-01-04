module.exports = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).render('403', {
      pageTitle: 'Access Denied',
      path: '/403',
      errorMessage: 'Access Denied. Log-in as admin to get access.',
    });
  }
  next();
};
