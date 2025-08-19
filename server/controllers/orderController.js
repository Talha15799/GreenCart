import Order from "../models/Order.js";
import Product from "../models/product.js";
import stripe from "stripe";
import User from "../models/user.js";




// ===================== Place Order COD =====================
export const placeOrderCOD = async (req, res) => {
  try {
    const { items, address } = req.body;
    const userId = req.userId;

    if (!address || items.length === 0) {
      return res.json({ success: false, message: "Invalid data" });
    }

    // calculate amount
    let amount = await items.reduce(async (acc, item) => {
      const productDoc = await Product.findById(item.product);
      if (!productDoc) throw new Error("Product not found");
      return (await acc) + productDoc.offerPrice * item.quantity;
    }, 0);

    // add 2% tax
    amount += Math.floor(amount * 0.02);

    await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "COD",
    });

    return res.json({ success: true, message: "Order placed with COD" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// ===================== Place Order Stripe =====================
export const placeOrderStripe = async (req, res) => {
  try {
    const { items, address } = req.body;
    const userId = req.userId;
    const { origin } = req.headers;

    if (!address || items.length === 0) {
      return res.json({ success: false, message: "Invalid data" });
    }

    let productData = [];
    let amount = await items.reduce(async (acc, item) => {
      const product = await Product.findById(item.product);
      if (!product) throw new Error("Product not found");

      productData.push({
        name: product.name,
        price: product.offerPrice,
        quantity: item.quantity,
      });

      return (await acc) + product.offerPrice * item.quantity;
    }, 0);

    // add 2% tax
    amount += Math.floor(amount * 0.02);

    // save order first
    const order = await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "Online",
    });

    // Stripe session
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

    const line_items = productData.map((item) => ({
      price_data: {
        currency: "INR",
        product_data: { name: item.name },
        unit_amount: Math.floor(item.price + item.price * 0.02) * 100, // in paise
      },
      quantity: item.quantity,
    }));

    const session = await stripeInstance.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${origin}/loader?next=my-orders`,
      cancel_url: `${origin}/cart`,
      metadata: {
        orderId: order._id.toString(),
        userId,
      },
    });

    return res.json({ success: true, url: session.url });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
//stripe webhook:/stripe

export const stripeWebhooks = async (req, res) => {
  //stripe gateway initialization
  const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripeInstance.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
     res.status(400).send(`Webhook Error: ${error.message}`);
  }
  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded":{
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;

      //getting session metadata
      const session = await stripeInstance.checkout.sessions.list({
        payment_intent:paymentIntentId,
      });

      const {orderId, userId} = session.data[0].metadata;

      //mark payment as successful
      await Order.findByIdAndUpdate(orderId, {isPaid: true })

      //clear user cart
      await User.findByIdAndUpdate(userId, { cartItems: {}});
      
      break;

    }
    case "payment_intent.payment_failed":{
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;

      //getting session metadata
      const session = await stripeInstance.checkout.sessions.list({
        payment_intent:paymentIntentId,
      });

      const {orderId} = session.data[0].metadata;
      await Order.findByIdAndDelete(orderId);
   break;
    }

      
  
    default:
      console.error(`Unhandled event type ${event.type}`);
      break;
  }
  res.json({ received: true });
}



// ===================== Get Orders by User ===================== /api/order/user
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.json({ success: false, message: "User ID missing" });
    }

    const orders = await Order.find({
      userId,
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ===================== Get All Orders (Admin / Seller) =====================
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
