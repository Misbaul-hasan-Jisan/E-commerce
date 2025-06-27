import React, { useContext, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import Breadcrumbs from '../component/Breadcrumbs/Breadcrumb';
import ProductDisplay from '../component/ProductDisplay/ProductDisplay';
import DescriptionBox from '../component/DescriptionBox/DescriptionBox';
import RelatedProducts from '../component/RelatedProducts/RelatedProducts';

const Product = () => {
  const { productId } = useParams();
  const { all_product } = useContext(ShopContext);

  const product = useMemo(() => {
    if (!all_product || all_product.length === 0) return null;
    return all_product.find((item) => item.id === Number(productId));
  }, [all_product, productId]);

  if (!all_product.length) {
    return <div>Loading products...</div>; // Products not fetched yet
  }

  if (!product) {
    return <div>Product not found.</div>; // No product matches ID
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
