import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './component/Navbar/Navbar'
import LoginSignup from './Pages/LoginSignup'
import Shop from './Pages/Shop'
import ShopCatagory from './Pages/ShopCategory'
import Product from './Pages/Product'
import Cart from './Pages/Cart'
import Footer from './component/Footer/Footer'
import men_banner from './component/Assets/banner_mens.png'
import women_banner from './component/Assets/banner_women.png'
import kid_banner from './component/Assets/banner_kids.png'
import OrderConfirmation from './component/OrderConfirmation/OrderConfirmation'


function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/' element={<Shop />} />
        <Route path='/mens' element={<ShopCatagory banner={men_banner} category="mens" />} />
        <Route path='/womens' element={<ShopCatagory banner={women_banner} category="womens" />} />
        <Route path='/kids' element={<ShopCatagory banner ={kid_banner} category="kids" />} />
        <Route path='/product/:productId' element={<Product />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/login' element={<LoginSignup />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
