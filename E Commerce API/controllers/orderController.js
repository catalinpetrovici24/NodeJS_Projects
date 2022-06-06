const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { checkPermissions } = require(`../utils`);
const Order = require('../models/Order');
const Product = require('../models/Product');

const fakeStripeAPI = async ({ amount, currency }) => {
  const client_secret = 'randomValue';
  return { client_secret, amount };
};

const getAllOrders = async (req, res) => {
  res.status(StatusCodes.OK).json({ msg: 'Get All Orders' });
};

const getSingleOrder = async (req, res) => {
  res.status(StatusCodes.OK).json({ msg: 'Get Single Order' });
};

const getCurrentUserOrders = async (req, res) => {
  res.status(StatusCodes.OK).json({ msg: 'Get Current User Orders' });
};

const createOrder = async (req, res) => {
  const { items: cartItems, tax, shippingFee } = req.body;

  if (!cartItems || cartItems.length < 1)
    throw new CustomError.BadRequestError('No Cart Items Provided');

  if (!tax || !shippingFee)
    throw new CustomError.BadRequestError(
      'Please provide tax and shipping fee'
    );

  let orderItems = [];
  let subtotal = 0;

  for (const item of cartItems) {
    const dbProduct = await Product.findOne({ _id: item.product });

    if (!dbProduct)
      throw new CustomError.NotFoundError(
        `No product with id: ${item.product}`
      );

    const { name, price, image, _id } = dbProduct;

    const singleOrderItem = {
      amount: item.amount,
      name,
      price,
      image,
      product: _id,
    };

    // add item to order
    orderItems = [...orderItems, singleOrderItem];

    //calculate subtotal
    subtotal += item.amount * price;
  }
  // calculate total
  const total = tax + shippingFee + subtotal;

  // get client secret
  const paymentIntent = await fakeStripeAPI({ amount: total, currency: 'ron' });

  const order = await Order.create({
    orderItems,
    total,
    subtotal,
    tax,
    shippingFee,
    clientSecret: paymentIntent.client_secret,
    user: req.user.userId,
  });

  res
    .status(StatusCodes.CREATED)
    .json({ order, clientSecret: order.clientSecret });
};

const updateOrder = async (req, res) => {
  res.status(StatusCodes.OK).json({ msg: 'Update Order' });
};

module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
};
