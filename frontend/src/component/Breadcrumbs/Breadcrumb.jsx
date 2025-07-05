import React from 'react';
import './Breadcrumb.css';
import arrow_icon from '../Assets/breadcrum_arrow.png';
import { Link } from 'react-router-dom';

const Breadcrumbs = ({ product }) => {
  return (
    <nav aria-label="Breadcrumb" className='breadcrumb'>
      <ol className="breadcrumb-list">
        <li className="breadcrumb-item">
          <Link to="/" className="breadcrumb-link">Home</Link>
          <img src={arrow_icon} alt="" className="breadcrumb-separator" />
        </li>
        <li className="breadcrumb-item">
          <Link to="/shop" className="breadcrumb-link">Shop</Link>
          <img src={arrow_icon} alt="" className="breadcrumb-separator" />
        </li>
        <li className="breadcrumb-item">
          <Link to={`/category/${product.category}`} className="breadcrumb-link">
            {product.category}
          </Link>
          <img src={arrow_icon} alt="" className="breadcrumb-separator" />
        </li>
        <li className="breadcrumb-item" aria-current="page">
          <span className="breadcrumb-current">{product.name}</span>
        </li>
      </ol>
    </nav>
  );
};

export default Breadcrumbs;