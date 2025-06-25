import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import Breadcrumbs from '../component/Breadcrumbs/Breadcrumb';
import ProductDisplay from '../component/ProductDisplay/ProductDisplay';
import DescriptionBox from '../component/DescriptionBox/DescriptionBox';
import RelatedProducts from '../component/RelatedProducts/RelatedProducts';

const Product = () => {
  const { productId } = useParams();
  const { all_product } = useContext(ShopContext);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (all_product && all_product.length > 0) {
      const foundProduct = all_product.find((item) => item.id === Number(productId));
      setProduct(foundProduct);
    }
  }, [productId, all_product]);

  if (!product) {
    return <div>Loading product...</div>;
  }

  return (
    <div>
      <Breadcrumbs product={product} />
      <ProductDisplay product={product} />
      <DescriptionBox />
      <RelatedProducts />
    </div>
  );
};

export default Product;