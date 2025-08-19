import React from 'react';
import { useAppContext } from '../Context/AppContext';
import { categories } from '../assets/assets.js';
import ProductCart from '../Components/ProductCart';
import { useParams } from 'react-router-dom';

const ProductCategory = () => {
  const { products } = useAppContext();
  const { category } = useParams(); // gets "fruits", "vegetables", etc.

  // Find matching category object
  const searchCategory = categories.find(
    (item) => item.path.toLowerCase() === category
  );

  // Filter products
  const filteredProducts = products.filter(
    (product) => product.category.toLowerCase() === category
  );

  return (
    <div className='mt-16'>
      {searchCategory && (
        <div className='flex flex-col items-end w-max'>
          <p className='text-2xl font-medium'>{searchCategory.text.toUpperCase()}</p>
          <div className='w-16 h-0.5 bg-primary rounded-full'></div>
        </div>
      )}

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6 mt-6'>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product, index) => (
            <ProductCart key={index} product={product} />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No products found in this category.
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductCategory;
