import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import "./Sidebar.css";
import add_product_icon from "../../assets/Product_Cart.svg";
import list_product_icon from "../../assets/Product_list_icon.svg";
import all_upload from "../../assets/all_upload.svg";
import orders_icon from "../../assets/order_icon.svg";
import { checkAdminStatus } from "../../utils/auth";
import { FaTimes } from "react-icons/fa";

const Sidebar = ({ isMobileOpen, onClose }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAdminStatus = async () => {
      try {
        const adminStatus = await checkAdminStatus();
        setIsAdmin(adminStatus);
        
        // Redirect if not admin and trying to access admin-only routes
        if (!adminStatus && location.pathname.startsWith("/admin")) {
          navigate("/");
        }
      } catch (error) {
        console.error("Failed to verify admin status:", error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    verifyAdminStatus();
  }, [location.pathname, navigate]);

  const navItems = [
    {
      path: "/admin/orders",
      icon: orders_icon,
      label: "Orders",
      adminOnly: true,
    },
    {
      path: "/add-product",
      icon: add_product_icon,
      label: "Add Product",
      adminOnly: true,
    },
    {
      path: "/list-product",
      icon: list_product_icon,
      label: "Products",
      adminOnly: false,
    },
    {
      path: "/bulk-upload",
      icon: all_upload,
      label: "Bulk Upload",
      adminOnly: true,
    },
  ];

  const handleLinkClick = () => {
    if (onClose && window.innerWidth <= 992) {
      onClose();
    }
  };

  if (loading) {
    return (
      <aside className={`sidebar ${isMobileOpen ? "active" : ""}`}>
        <div className="sidebar-loading">Loading...</div>
      </aside>
    );
  }

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
            if (item.adminOnly && !isAdmin) return null;

            const isActive = location.pathname === item.path || 
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
        {isAdmin ? (
          <p className="admin-status">Admin privileges active</p>
        ) : (
          <p className="admin-status">Limited access mode</p>
        )}
      </div>
    </aside>
  );
};

Sidebar.propTypes = {
  isMobileOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

export default Sidebar;