import React, { useEffect, useState } from 'react';
import './ProductList.css';
import cross_icon from '../../assets/cross_icon.png';

const ProductList = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllProducts = async () => {
    try {
      const response = await fetch("https://e-commerce-8j0j.onrender.com/all-products");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data); // Debug log
      setAllProducts(data);
    } catch (err) {
      console.error("API Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const removeProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch("https://e-commerce-8j0j.onrender.com/remove-product", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) throw new Error('Deletion failed');
      fetchAllProducts(); // Refresh list
    } catch (err) {
      console.error("Deletion Error:", err);
      alert("Failed to delete product");
    }
  };

  if (loading) return <div className="loading">Loading products...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="product-list-container">
      <div className="product-list">
        <h1>All Products List</h1>
        <div className="list-header">
          <span>Image</span>
          <span>Name</span>
          <span>Old Price</span>
          <span>New Price</span>
          <span>Category</span>
          <span>Action</span>
        </div>

        {allProducts.length > 0 ? (
          allProducts.map((product) => (
            <div key={product.id} className="product-item">
              <img src={product.image} alt={product.name} />
              <span data-label="Name">{product.name}</span>
              <span data-label="Old Price">${product.old_price}</span>
              <span data-label="New Price">${product.new_price}</span>
              <span data-label="Category">{product.category}</span>
              <button onClick={() => removeProduct(product.id)}>
                <img src={cross_icon} alt="Delete" />
              </button>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <p>No products found</p>
            <p>Check if:</p>
            <ul>
              <li>Your backend is running</li>
              <li>MongoDB has products</li>
              <li>API endpoint is correct</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
