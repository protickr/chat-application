// inbox page
const getInbox = function (req, res, next) {
    res.render('inbox', {data: []});
};

module.exports = { getInbox };