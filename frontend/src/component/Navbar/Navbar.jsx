import { useContext, useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Navbar.css'
import logo from '../Assets/logo.png'
import cart_icon from '../Assets/cart_icon.png'
import { ShopContext } from '../../context/ShopContext'

const Navbar = () => {
  const [menu, setMenu] = useState('Shop')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { getTotalCartItems, cartItems, isLoggedIn, handleLogout } = useContext(ShopContext)
  const menuRef = useRef()
  const navigate = useNavigate()

  const handleLogoutClick = () => {
    handleLogout()
    navigate('/')
    setMobileMenuOpen(false)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  return (
    <div className='navbar'>
      <button 
        className="mobile-menu-toggle" 
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? '✕' : '☰'}
      </button>

      <div className='nav-logo'>
        <img src={logo} alt='' />
        <p>Shopper</p>
      </div>

      <div 
        className={`mobile-menu-overlay ${mobileMenuOpen ? 'active' : ''}`} 
        onClick={closeMobileMenu}
      />

      <ul ref={menuRef} className={`nav-menu ${mobileMenuOpen ? 'active' : ''}`}>
        <li onClick={() => { setMenu("Shop"); closeMobileMenu(); }}>
          <Link to='/' style={{textDecoration: 'none', color: 'black'}}>Shop</Link>
          {menu === "Shop" ? <hr /> : null}
        </li>
        <li onClick={() => { setMenu("Men"); closeMobileMenu(); }}>
          <Link to='/mens' style={{textDecoration: 'none', color: 'black'}}>Men</Link>
          {menu === "Men" ? <hr /> : null}
        </li>
        <li onClick={() => { setMenu("Women"); closeMobileMenu(); }}>
          <Link to='/womens' style={{textDecoration: 'none', color: 'black'}}>Women</Link>
          {menu === "Women" ? <hr /> : null}
        </li>
        <li onClick={() => { setMenu("Kids"); closeMobileMenu(); }}>
          <Link to='/kids' style={{textDecoration: 'none', color: 'black'}}>Kids</Link>
          {menu === "Kids" ? <hr /> : null}
        </li>
      </ul>

      <div className="nav-login-cart">
        {isLoggedIn ? (
          <button onClick={handleLogoutClick}>Logout</button>
        ) : (
          <Link to='/login'><button>Login</button></Link>
        )}
        <Link to='/cart'><img src={cart_icon} alt='cart icon' /></Link>
        <div className="nav-cart-count">{getTotalCartItems()}</div>
      </div>
    </div>
  )
}

export default Navbar