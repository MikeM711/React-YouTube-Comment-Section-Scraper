const express = require('express');
const router = express.Router();

router.use('/', require('./main-app'));

module.exports = router;