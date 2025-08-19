import React from 'react';
import ProductCart from './ProductCart';
import { useAppContext } from '../Context/AppContext';

const Bestseller = () => {
  const { products } = useAppContext();

  if (!products || products.length === 0) {
    return null; // nothing to show
  }

  return (
    <div className="mt-16">
      <p className="text-2xl md:text-3xl font-medium">Best Sellers</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-8 gap-y-8 mt-6">
        {products
          .filter((p) => p && p.inStock)
          .slice(0, 5)
          .map((p, index) => (
            <ProductCart key={p._id || index} product={p} />
          ))}
      </div>
    </div>
  );
};

export default Bestseller;