// users page
const getUsers = function (req, res, next) {
    res.render('users', {});
};

module.exports = { getUsers };