import React, { useState } from 'react'
import './DescriptionBox.css'

const DescriptionBox = () => {
  const [activeTab, setActiveTab] = useState('description')

  return (
    <div className='descriptionbox'>
      <div className="descriptionbox-navigator">
        <div 
          className={`descriptionbox-navbox ${activeTab === 'description' ? 'active' : ''}`}
          onClick={() => setActiveTab('description')}
        >
          Description
        </div>
        <div 
          className={`descriptionbox-navbox ${activeTab === 'reviews' ? 'active' : 'fade'}`}
          onClick={() => setActiveTab('reviews')}
        >
          Reviews (122)
        </div>
      </div>
      
      <div className="descriptionbox-description">
        {activeTab === 'description' ? (
          <>
            <p>An e-commerce website is an online platform that facilitates the buying and selling of products or services over the internet. It serves as a marketplace where businesses and individuals can showcase their products, interact with customers, and conduct transactions without the need for a physical presence.</p>
            <p>E-commerce websites typically display products or services along with detailed descriptions, images, prices and any available variations (e.g., sizes, colors). Each product usually has its own dedicated page with relevant information.</p>
          </>
        ) : (
          <div className="reviews-section">
            <p>Customer reviews will be displayed here</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default DescriptionBox