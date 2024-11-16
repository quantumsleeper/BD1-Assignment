const express = require('express');
const cors = require('cors');
const { resolve } = require('path');

const app = express();
app.use(cors());
// const port = 3000;

app.use(express.static('static'));

// Server-side values
let taxRate = 5; // 5%
let discountPercentage = 10; // 10%
let loyaltyRate = 2; // 2 points per $1

function getDiscountedPrice(cartTotal) {
  let discountedPrice = (1 - discountPercentage / 100) * cartTotal;
  return discountedPrice;
}

function calculateTax(cartTotal) {
  return (taxRate / 100) * cartTotal;
}

function getDeliveryTime(distance, shippingMethod) {
  let stride;
  if (shippingMethod == 'express') {
    stride = 100;
  } else {
    stride = 50;
  }
  return distance / stride;
}

app.get('/cart-total', (req, res) => {
  let newItemPrice = parseFloat(req.query.newItemPrice);
  let cartTotal = parseFloat(req.query.cartTotal);
  let newCartTotal = cartTotal + newItemPrice;
  res.send(newCartTotal.toString());
});

app.get('/membership-discount', (req, res) => {
  let cartTotal = parseFloat(req.query.cartTotal);
  let isMember = req.query.isMember === 'true';
  if (isMember) {
    res.send(getDiscountedPrice(cartTotal).toString());
  } else {
    res.send(cartTotal.toString());
  }
});

app.get('/calculate-tax', (req, res) => {
  let cartTotal = parseFloat(req.query.cartTotal);
  res.send(calculateTax(cartTotal).toString());
});

app.get('/estimate-delivery', (req, res) => {
  let distance = parseFloat(req.query.distance);
  let shippingMethod = req.query.shippingMethod;
  res.send(getDeliveryTime(distance, shippingMethod).toString());
});

app.get('/shipping-cost', (req, res) => {
  let weight = parseFloat(req.query.weight);
  let distance = parseFloat(req.query.distance);
  let shippingCost = weight * distance * 0.1;
  res.send(shippingCost.toString());
});

app.get('/loyalty-points', (req, res) => {
  let purchaseAmount = parseFloat(req.query.purchaseAmount);
  let loyaltyPoints = purchaseAmount * loyaltyRate;
  res.send(loyaltyPoints.toString());
});

// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`);
// });
