const router = require('express').Router()
const { registerUser, loginUser, logout, getUser } = require('../controllers/userController')
const protect = require('../middleware/authMiddleware')

router.post('/register',registerUser)
router.post('/login',loginUser)
router.get('/logout',logout)
router.get('/me',protect,getUser)

module.exports = router