import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.headers.post['Content-Type'] = 'application/json';

// Create the context
export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState({});

  // Fetch seller status
  const fetchSeller = async () => {
    try {
      const { data } = await axios.get("/api/seller/is-auth");
      setIsSeller(!!data.success);
    } catch {
      setIsSeller(false);
    }
  };
  //Fetch user auth status,user data and cart items
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        setUser(null);
        setCartItems({});
        return;
      }
      const { data } = await axios.get('/api/user/is-auth');
      if (data.success) {
        setUser(data.user)
        setCartItems(data.user.cartItems)
      }
    }
        catch {
    setUser(null)
  }
}







// Fetch products from backend
const fetchProducts = async () => {
  try {
    const { data } = await axios.get("/api/product/list");
    if (data.success) {
      setProducts(data.products);
    } else {
      toast.error(data.message)
    }
  } catch (error) {
    toast.error(error.message)
  }
};

// Add product to cart
const addToCart = (itemId) => {
  const cartData = structuredClone(cartItems);
  cartData[itemId] = (cartData[itemId] || 0) + 1;
  setCartItems(cartData);
  toast.success("Added to cart");
};

// Update cart items
const updateCartItems = (itemId, quantity) => {
  const cartData = structuredClone(cartItems);
  cartData[itemId] = quantity;
  setCartItems(cartData);
  toast.success("Cart updated");
};

// Remove item from cart
const removeFromCart = (itemId) => {
  const cartData = structuredClone(cartItems);
  if (cartData[itemId]) {
    cartData[itemId] -= 1;
    if (cartData[itemId] === 0) {
      delete cartData[itemId];
    }
  }
  setCartItems(cartData);
  toast.success("Item removed from cart");
};

// Get total count of cart items
const getCartCount = () => {
  return Object.values(cartItems).reduce((total, qty) => total + qty, 0);
};

// Get total price of cart items
const getCartTotalPrice = () => {
  let totalPrice = 0;
  for (const item in cartItems) {
    const itemInfo = products.find((p) => p._id === item);
    if (itemInfo && cartItems[item] > 0) {
      totalPrice += itemInfo.offerPrice * cartItems[item];
    }
  }
  return Math.floor(totalPrice * 100) / 100;
};

// Initial load
useEffect(() => {
  fetchSeller();
  fetchProducts();
  fetchUser();
}, []);


//update database cart items
useEffect(()=>{
const updateCart = async () => {
    if (!user || !user._id) {
        toast.error("User not authenticated. Please log in.");
        return;
    }
  try {
    const { data } = await axios.post('/api/cart/update', { userId: user._id, cartItems })
    if (!data.success) {
      toast.error(data.message);
    }
  }catch(error){
    toast.error(error.message)
  }
    }
    if(user){
      updateCart()
    }
  },[cartItems])
    
    
    
   


const value = {
  navigate,
  user,
  setUser,
  isSeller,
  setIsSeller,
  showUserLogin,
  setShowUserLogin,
  products,
  currency,
  addToCart,
  updateCartItems,
  removeFromCart,
  cartItems,
  searchQuery,
  setSearchQuery,
  getCartCount,
  getCartTotalPrice,
  axios,
  fetchProducts,
  setCartItems // so you can refresh after adding a product
};

return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook to use context
export const useAppContext = () => {
  return useContext(AppContext);
};