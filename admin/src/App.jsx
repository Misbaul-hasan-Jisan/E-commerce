import React, { useState } from 'react';
import './App.css';
import Navbar from './Components/Navbar/Navbar';
import { Routes, Route, Navigate } from 'react-router-dom';
import AddProduct from './Components/AddProduct/AddProduct';
import ProductList from './Components/ProductList/ProductList';
import BulkUpload from './Components/BulkUpload/BulkUpload';
import Sidebar from './Components/Sidebar/Sidebar';
import AdminOrders from './Components/AdminOrder/AdminOrders';
import AdminLogin from './Pages/Admin/Login/AdminLogin';

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="app-container">
      <Sidebar isMobileOpen={isSidebarOpen} onClose={closeSidebar} />

      {/* Mobile toggle button */}
      <button className="hamburger-btn" onClick={toggleSidebar}>
        ☰
      </button>

      {/* Optional dark overlay */}
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar}></div>
      )}

      <div className="main-content">
        <Navbar />
        <div className='admin-content'>
          <Routes>
            {/* Redirect root path to /admin/orders */}
            <Route path="/" element={<Navigate to="/admin/orders" replace />} />
            <Route path='/bulk-upload' element={<BulkUpload />} />
            <Route path='/add-product' element={<AddProduct />} />
            <Route path='/list-product' element={<ProductList />} />
            <Route path='/admin/orders' element={<AdminOrders />} />
            <Route path="/admin/login" element={<AdminLogin />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
