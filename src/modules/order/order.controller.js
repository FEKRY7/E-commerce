const cartModel = require("../../../Database/models/Cart.model.js");
const productModel = require("../../../Database/models/product.model.js");
const cuponModel = require("../../../Database/models/cupon.model");
const orderModel = require("../../../Database/models/orderModel.js");
const cloudinary = require("../../utils/cloud.js");
const createInvoice = require("../../utils/pdfInvoice.js");
const path = require("path");
const sendEmail = require("../../utils/sendEmail.js");
const { clearCart, updateStock } = require("./order.service.js");
const Stripe = require("stripe");
const http = require('../../folderS,F,E/S,F,E.JS')
const {Firest,Schand,Thered} = require('../../utils/httperespons.js')


const createOrder = async (req, res) => {
  try {  
    // Check for cupon
    let checkCupon;
    if (req.body.cupon) {
      const userCupon = await cuponModel.findOne({
        name: req.body.cupon,
        expiredAt: { $gt: Date.now() },
      });
      checkCupon = userCupon;
      if (!userCupon) {
        return Firest(res,"Invalid cupon",400,http.FAIL)
      }
    }
 
    // Get the products from the cart
    const cart = await cartModel.findOne({ user: req.user._id });
    const products = cart.products;
    if (products.length < 1) {
      return Firest(res,"Empty Cart",400,http.FAIL)
    }

    // Check the validity of the products
    const orderProducts = [];
    let orderPrice = 0;

    for (let i = 0; i < products.length; i++) {
      const product = await productModel.findById(products[i].productId);
      if (!product) {
        return Firest(res,`${products[i].productId}  is not found`,404,http.FAIL)
      }

      if (products[i].quantity > product.quantity){
        return Firest(res,`${product.name} out of stock , only ${product.quantity} is avilable`,400,http.FAIL)
      }
        

      // check the validty of the products

      orderProducts.push({
        name: product.name,
        quantity: products[i].quantity,
        itemPrice: product.price,
        totalPrice: product.price * products[i].quantity,
        productId: products[i].productId,
      });

      orderPrice += product.price * products[i].quantity;
    }

    const order = await orderModel.create({
      user: req.user._id,
      phone: req.body.phone,
      address: req.body.address,
      payment: req.body.payment,
      products: orderProducts,
      price: orderPrice,
      cupon: {
        id: checkCupon?._id,
        name: checkCupon?.name,
        discount: checkCupon?.discount,
      },
    });

    const invoice = {
      shipping: {
        name: req.user.name,
        address: order.address,
        country: "Egypt",
      },
      items: order.products,
      subtotal: order.price,
      paid: order.finalPrice,
      invoice_nr: order._id,
    };

    const pdfPath = path.join(__dirname, `./../../invoices/${order._id}.PDF`);
    await createInvoice(invoice, pdfPath);

    const { secure_url, public_id } = await cloudinary.uploader.upload(
      pdfPath,
      { folder: `${process.env.CLOUD_FOLDER_NAME}/order/invoices` }
    );
    order.invoice = { url: secure_url, id: public_id };
    await order.save();

    const isSent = await sendEmail({
      to: req.user.email,
      subject: "Order Invoice",
      attachments: [{ url: secure_url, contentType: "application/PDF" }],
    }); 

    if (!isSent) {
      return Firest(res,"Invoice wasn't sent by email",404,http.FAIL)
    }

    updateStock(order.products, true);
    clearCart(req.user._id);

    if (req.body.payment === "visa") {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      let cuponExisted;
      if (order.cupon.name !== undefined) {
        cuponExisted = await stripe.coupons.create({
          percent_off: order.cupon.discount,
          duration: "once",
        });
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        metadata: { order_id: order._id.toString() },
        mode: "payment",
        success_url: "http://localhost:5500/sucessPage.html",
        cancel_url: "http://localhost:5500/cancelPage.html",
        line_items: order.products.map((product) => {
          return {
            price_data: {
              currency: "egp",
              product_data: { name: product.name },
              unit_amount: product.itemPrice * 100,
            },
            quantity: product.quantity,
          };
        }),
        discounts: cuponExisted ? [{ coupon: cuponExisted.id }] : [],
      });
      return Schand(res,{results: session.url},order,200,http.SUCCESS)
    }

    Schand(res,order,200,http.SUCCESS)

  } catch (error) {
    console.error(error);
    return Thered(res, 'Internal Server Error', 500, http.ERROR);    
  }
};



const cancelOrder = async (req, res) => {
try{
  const order = await orderModel.findById(req.params.id);
  if (!order) {
    return Firest(res,"order in not found check again",404,http.FAIL)
  }

  if (
    (order.status == "shipped" || order.status === "deliverd",
    order.status === "canceled")
  ) {
    return Firest(res,"Order is already shipped or deliverd check the status again",400,http.FAIL)
  }

  order.status = "canceled";
  await order.save();

  updateStock(order.products, false);

  Schand(res,"order canceled",200,http.SUCCESS)
}catch (error) {
  console.error(error);
  return Thered(res, 'Internal Server Error', 500, http.ERROR);    
}
};



const orderWebhook = async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log(err);
    return Firest(res,`Webhook Error: ${err.message}`,400,http.FAIL)
  }

  const orderId = event.data.object.metadata.order_id;

  if (event.type === "checkout.session.completed") {
    await orderModel.findOneAndUpdate(
      { _id: orderId },
      { status: "Paid by visa" }
    );
    return;
  }
  await orderModel.findOneAndUpdate(
    { _id: orderId },
    { status: "faild to pay" }
  );
  return;
};

module.exports = {
  createOrder,
  cancelOrder,
  orderWebhook,
};