import React, { useEffect, useState } from 'react'
import { useAppContext } from '../Context/AppContext'; // ✅ named export
//import {dummyOrders} from '../assets/assets.js' // Assuming you have a dummy data file for orders

const MyOrders = () => {
  const [myOrders, setMyOrders] = useState([]);
  const { currency ,axios,user} = useAppContext();

  const fetchMyOrders = async () => {
    try {
      const {data}=await axios.get('/api/order/user')
      if(data.success){
        setMyOrders(data.orders)
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    if(user){
fetchMyOrders();
    }
    
  }, [user])

  return (
    
<div className="mt-10 p-8 max-w-5xl mx-auto">
  {/* Page Title */}
  <div className="flex flex-col items-end w-max mb-6">
    <p className="text-2xl font-semibold uppercase">My Orders</p>
    <div className="w-16 h-0.5 bg-primary rounded-full"></div>
  </div>

  {myOrders.map((order, index) => (
    <div
      className="border border-gray-200 rounded-lg overflow-hidden mb-6 shadow-sm hover:shadow-md transition p-4"
      key={index}
    >
      {/* Order Header */}
      <div className="grid grid-cols-12 gap-4 text-gray-600 text-sm items-center">
        {/* Order ID */}
        <span className="col-span-5 font-medium text-gray-700 text-left">
          OrderId: {order._id}
        </span>

        {/* Payment */}
        <span className="col-span-3 text-center md:text-left">
          Payment: {order.paymentType}
        </span>

        {/* Total */}
        <span className="col-span-4 text-right font-bold text-gray-800">
          Total: {currency}{order.amount}
        </span>
      </div>

      {/* Order Items */}
      {order.items.map((item, idx) => (
        <div
          key={idx}
          className={`grid grid-cols-12 gap-6 border-t border-gray-200 py-4 ${
            idx === 0 ? "border-t-0" : ""
          }`}
        >
          {/* Product Info */}
          <div className="col-span-5 flex items-center">
            <div className="bg-primary/10 p-3 rounded-lg">
              <img
                src={item.product.image[0]}
                alt={item.product.name}
                className="w-14 h-14 object-contain"
              />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-gray-800">
                {item.product.name}
              </h2>
              <p className="text-sm text-gray-500">
                Category: {item.product.category}
              </p>
            </div>
          </div>

          {/* Quantity, Status, Date */}
          <div className="col-span-3 flex flex-col text-sm text-gray-700 md:text-left">
            <p>Quantity: {item.quantity || "1"}</p>
            <p>Status: {order.status}</p>
            <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
          </div>

          {/* Amount */}
          <p className="col-span-4 text-primary text-lg font-semibold md:text-right">
            ₹{item.product.offerPrice * item.quantity}
          </p>
        </div>
      ))}
    </div>
  ))}
</div>
  )
}

export default MyOrders