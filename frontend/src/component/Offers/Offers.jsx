import React from 'react'
import './Offers.css'
import exclusive_image from '../Assets/exclusive_image.webp'

const Offers = () => {
  return (
    <div className='offers'>
      <div className="offers-left">
        <h1>EXCLUSIVE</h1>
        <h2>Offers for you</h2>
        <p>ONLY ON BEST SELLING PRODUCTS</p>
        <button>Check Now</button>
      </div>
      <div className="offers-right">
        <img src={exclusive_image} alt="" />
      </div>
    </div>
  )
}

export default Offers
