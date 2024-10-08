const express = require('express');

const router = express.Router();

router.route('/api', (req, res) => {
    res.send({ message: 'Home' });
});

module.exports = router;
