import React from "react";
import { assets } from "../assets/assets.js";
import { useAppContext } from "../Context/AppContext";

const ProductCart = ({ product }) => {
  const { currency, addToCart, removeFromCart, cartItems, navigate } =
    useAppContext();

  // ✅ Prevent rendering if product is missing
  if (!product || typeof product !== 'object') {
    console.warn('ProductCart: product prop is missing or invalid');
    return null;
  }

  const category = product?.category || "";
  const name = product.name || "Unnamed Product";
  const image = product.image?.[0] || assets.placeholder_image; // use fallback image
  const offerPrice = product.offerPrice ?? 0;
  const price = product.price ?? 0;
  const productId = product._id || "";

  return (
    <div
      onClick={() => {
        if (productId && category) {
          navigate(`/products/${category?.toLowerCase()}/${productId}`);
          scrollTo(0, 0);
        }
      }}
      className="border border-gray-500/20 rounded-md px-4 py-2 bg-white w-full h-[320px] flex flex-col justify-between"
    >
      <div>
        <div className="group cursor-pointer flex items-center justify-center h-[140px] md:h-[160px] w-full">
          <img
            className="group-hover:scale-105 transition max-h-full max-w-full object-contain object-center"
            src={image}
            alt={name}
          />
        </div>
        <div className="text-gray-500/60 text-sm flex flex-col justify-start gap-1 h-[80px]">
          <p>{category}</p>
          <p className="text-gray-700 font-medium text-sm md:text-base line-clamp-1">
            {name}
          </p>
          <div className="flex items-center gap-0.5">
            {Array(5)
              .fill("")
              .map((_, i) => (
                <img
                  key={i}
                  src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                  alt=""
                  className="md:w-3.5 w-3"
                />
              ))}
            <p>(4)</p>
          </div>
        </div>
      </div>

      <div className="flex items-end justify-between mt-2">
        <p className="md:text-xl text-base font-medium text-primary">
          {currency}
          {offerPrice}{" "}
          <span className="text-gray-500/60 md:text-sm text-xs line-through">
            {currency}
            {price}
          </span>
        </p>

        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="text-primary"
        >
          {!cartItems[productId] ? (
            <button
              className="flex items-center justify-center gap-1 bg-primary/10 border border-primary/40 md:w-[80px] w-[64px] h-[34px] rounded cursor-pointer font-medium"
              onClick={() => productId && addToCart(productId)}
            >
              <img src={assets.cart_icon} alt="cart_icon" />
              Add
            </button>
          ) : (
            <div className="flex items-center justify-center gap-2 md:w-20 w-16 h-[34px] bg-primary/25 rounded select-none">
              <button
                onClick={() => productId && removeFromCart(productId)}
                className="cursor-pointer text-md px-2 h-full"
              >
                -
              </button>
              <span className="w-5 text-center">
                {cartItems[productId]}
              </span>
              <button
                onClick={() => productId && addToCart(productId)}
                className="cursor-pointer text-md px-2 h-full"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCart;