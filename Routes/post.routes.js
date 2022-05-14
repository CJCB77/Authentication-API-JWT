const express = require('express');
const router = express.Router();
const authVerify = require('../middleware/verifyToken');


//We should not be able to access the following routes without a token
router.get('/', authVerify , (req, res) => {
  res.json({posts:{title: 'Post 1', content: 'This is post 1'}});
});

module.exports = router;