import "./App.css";
import React, { createContext, useReducer } from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";

// Basic Pages
import Login from "./pages/basic/Login";
import Signup from "./pages/basic/Signup";
import Logout from "./pages/basic/Logout";
import Errorpage from "./pages/basic/Errorpage";

import ForgetPassword from "./pages/basic/ForgetPassword";
import ResetPassword from "./pages/basic/ResetPassword";

// Main pages
import HomePage from "./pages/HomePage";
import CategoryPage from "./pages/CategoryPage";

import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import OrderPage from "./pages/OrderPage";
import OrderSummery from "./pages/OrderSummery";

import Account from "./pages/Account";

// SELLER Pages
import SellerSignup from "./pages/seller/SellerSignup";
import SellerProfile from "./pages/seller/SellerProfile";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import { reducer, initialState } from "./reducer/UserReducer";

export const UserContext = createContext();

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <>
      <BrowserRouter>
        <UserContext.Provider value={{ state, dispatch }}>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/category/:category" element={<CategoryPage />} />

            <Route path="/product/:_id" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/order" element={<OrderPage />} />
            <Route path="/order-summery" element={<OrderSummery />} />

            <Route path="/account/" element={<Account />} />
            <Route path="/account/:route" element={<Account />} />

            <Route path="/seller/signup" element={<SellerSignup />} />
            <Route path="/seller/profile/:_id" element={<SellerProfile />} />

            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="*" element={<Errorpage />} />

            <Route path="/forget-password" element={<ForgetPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Routes>
          <Footer />
        </UserContext.Provider>
      </BrowserRouter>
    </>
  );
}

export default App;
