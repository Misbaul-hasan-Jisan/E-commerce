import React, { useState } from 'react';
import './Admin.css';
import Sidebar from '../../Components/Sidebar/Sidebar';
import { Routes, Route } from 'react-router-dom';
import AddProduct from '../../Components/AddProduct/AddProduct';
import ProductList from '../../Components/ProductList/ProductList';
import BulkUpload from '../../Components/BulkUpload/BulkUpload';
import AdminOrders from '../../Components/AdminOrder/AdminOrders';
import { FaBars } from 'react-icons/fa';

const Admin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className='admin'>
      <button 
        className="mobile-menu-toggle" 
        onClick={toggleSidebar}
        aria-label="Toggle menu"
      >
        <FaBars />
      </button>
      
      <Sidebar isMobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className={`admin-content ${sidebarOpen ? 'shifted' : ''}`}>
        <Routes>
          <Route path='/bulk-upload' element={<BulkUpload />} />
          <Route path='/add-product' element={<AddProduct />} />
          <Route path='/list-product' element={<ProductList />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
        </Routes>
      </div>
    </div>
  );
};

export default Admin;
