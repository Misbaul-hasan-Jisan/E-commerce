import React from 'react'
import './Breadcrumb.css'
import arrow_icon from '../Assets/breadcrum_arrow.png';

const Breadcrumbs = (props) => {
    const {product} = props;
  return (
    <div className='bread-crumb'>
      Home <img src={arrow_icon} alt="" /> Shop <img src={arrow_icon} alt="" /> {product.catagory} <img src={arrow_icon} alt="" /> {product.name}
    </div>
  )
}

export default Breadcrumbs