import React, { useContext, useState } from 'react';
import './ProductDisplay.css';
import star_icon from '../Assets/star_icon.png';
import star_dull_icon from '../Assets/star_dull_icon.png';
import { ShopContext } from '../../context/ShopContext';

function ProductDisplay(props) {
    const { product } = props;
    const { addToCart } = useContext(ShopContext);
    const [selectedSize, setSelectedSize] = useState(null);

    const handleSizeSelection = (size) => {
        setSelectedSize(size);
    };

    const handleAddToCart = () => {
        if (!selectedSize) {
            alert('Please select a size before adding to cart');
            return;
        }
        addToCart(product.id, selectedSize);
    };

    return (
        <div className='product-display'>
            {/* LEFT SIDE */}
            <div className='product-display-left'>
                <div className="product-display-img-list">
                    <img src={product.image} alt="" />
                    <img src={product.image} alt="" />
                    <img src={product.image} alt="" />
                    <img src={product.image} alt="" />
                </div>
                <div className="product-display-img">
                    <img className='product-display-img-main' src={product.image} alt="" />
                </div>
            </div>

            {/* RIGHT SIDE */}
            <div className='product-display-right'>
                <h1>{product.name}</h1>
                <div className="product-display-rating">
                    <img src={star_icon} alt="" />
                    <img src={star_icon} alt="" />
                    <img src={star_icon} alt="" />
                    <img src={star_icon} alt="" />
                    <img src={star_dull_icon} alt="" />
                    <p>(122)</p>
                </div>
                <div className='product-display-prices'>
                    <div className="product-display-oldprice">${product.old_price}</div>
                    <div className="product-display-newprice">${product.new_price}</div>
                </div>
                <div className="product-display-description">
                    {product.description || "Add product description. I will probably create a product description attribute."}
                </div>
                <div className="product-display-right-size">
                    <h1>Select Size</h1>
                    <div className="product-display-right-size-options">
                        {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                            <div 
                                key={size}
                                className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                                onClick={() => handleSizeSelection(size)}
                            >
                                {size}
                            </div>
                        ))}
                    </div>
                </div>
                <button onClick={handleAddToCart}>Add to Cart</button>
                <p className='product-display-category'><span>Category: </span>{product.category}</p>
                <p className='product-display-category'><span>Tags: </span>Latest, High Quality, Offer, Premium</p>
            </div>
        </div>
    );
}

export default ProductDisplay;