const router = require('express').Router();
const controller = require('../controllers/orderController');

router.post('/', controller.createOrder);
router.get('/revenue', controller.getRevenue);

module.exports = router;