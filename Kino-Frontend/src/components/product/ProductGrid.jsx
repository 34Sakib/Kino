import React from 'react';
import { ProductCard } from './ProductCard';

export const ProductGrid = ({ products, columns = 4 }) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="font-editorial text-2xl text-muted italic">No pieces found matching selection.</p>
      </div>
    );
  }

  return (
    <div className="product-grid-container">
      <style>{`
        .product-grid {
          display: grid;
          grid-template-columns: repeat(${columns}, 1fr);
          gap: 1.5rem;
          width: 100%;
        }
        @media (max-width: 1024px) {
          .product-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 768px) {
          .product-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 575px) {
          .product-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
export default ProductGrid;
