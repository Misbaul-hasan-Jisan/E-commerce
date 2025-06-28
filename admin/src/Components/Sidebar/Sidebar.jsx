import React from "react";
import { Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import "./Sidebar.css";
import add_product_icon from "../../assets/Product_Cart.svg";
import list_product_icon from "../../assets/Product_list_icon.svg";
import all_upload from "../../assets/all_upload.svg";
import orders_icon from "../../assets/order_icon.svg";
import { FaTimes } from "react-icons/fa";

const Sidebar = ({ isMobileOpen, onClose }) => {
  const location = useLocation();

  const navItems = [
    {
      path: "/admin/orders",
      icon: orders_icon,
      label: "Orders",
    },
    {
      path: "/add-product",
      icon: add_product_icon,
      label: "Add Product",
    },
    {
      path: "/list-product",
      icon: list_product_icon,
      label: "Products",
    },
    {
      path: "/bulk-upload",
      icon: all_upload,
      label: "Bulk Upload",
    },
  ];

  const handleLinkClick = () => {
    if (onClose && window.innerWidth <= 992) {
      onClose();
    }
  };

  return (
    <aside
      className={`sidebar ${isMobileOpen ? "active" : ""}`}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Mobile close button */}
      {onClose && (
        <button
          className="sidebar-close-btn"
          onClick={onClose}
          aria-label="Close menu"
        >
          <FaTimes />
        </button>
      )}

      <div className="sidebar-header">
        <h2>SHOPPER</h2>
        <p>Admin Panel</p>
      </div>

      <nav className="sidebar-nav">
        <ul>
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path === "/admin/orders" &&
                location.pathname.startsWith("/admin/orders"));

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`sidebar-item ${isActive ? "active" : ""}`}
                  aria-current={isActive ? "page" : undefined}
                  onClick={handleLinkClick}
                >
                  <img
                    src={item.icon}
                    alt=""
                    className="sidebar-icon"
                    loading="lazy"
                    aria-hidden="true"
                  />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <p className="admin-status">Admin privileges active</p>
      </div>
    </aside>
  );
};

Sidebar.propTypes = {
  isMobileOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

export default Sidebar;
