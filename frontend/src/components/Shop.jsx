import React from 'react';
import products from '../data/Products.json'
import ProductCard from './ProductCard';

const Shop = () => {
  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map(product => (
        <ProductCard key={product.slug} product={product} />
      ))}
    </div>
  );
};

export default Shop;