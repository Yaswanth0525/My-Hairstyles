const isAdmin = (req, res, next) => {
    const { role } = req.userInfo;
    if (role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Forbidden, only admin can access this route!'
        });
    }
    next();
}
module.exports = isAdmin;