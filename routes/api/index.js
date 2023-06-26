const router = require('express').Router();
const thoughtsRoutes = require('./thoughts');
const usersRoutes = require('./users');

router.use('/thoughts', thoughtsRoutes);
router.use('/users', usersRoutes);

module.exports = router;