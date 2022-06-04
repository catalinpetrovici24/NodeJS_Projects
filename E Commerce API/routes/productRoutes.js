const express = require('express');
const router = express.Router();
const {
  authenticateUser,
  authorizePermissions,
} = require('../middleware/authentication');
const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
} = require(`../controllers/productController`);

// router

router.get('/', getAllProducts);
router.post(
  '/',
  authenticateUser,
  authorizePermissions('admin'),
  createProduct
);
router.post(
  '/uploadImage',
  authenticateUser,
  authorizePermissions('admin'),
  uploadImage
);
router.get('/:id', getSingleProduct);
router.patch(
  '/:id',
  authenticateUser,
  authorizePermissions('admin'),
  updateProduct
);
router.delete(
  '/:id',
  authenticateUser,
  authorizePermissions('admin'),
  deleteProduct
);

module.exports = router;
