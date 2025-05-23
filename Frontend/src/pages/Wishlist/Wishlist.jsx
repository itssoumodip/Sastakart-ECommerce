import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromWishlist } from '../../store/wishlistSlice';
import { addToCart } from '../../store/cartSlice';
import Button from '../../components/ui/Button';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Wishlist = () => {
  const { items } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();

  const handleRemoveFromWishlist = (id) => {
    dispatch(removeFromWishlist(id));
    toast.success('Item removed from wishlist');
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart({ product, quantity: 1 }));
    dispatch(removeFromWishlist(product.id));
    toast.success('Item added to cart');
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-6">Your Wishlist</h1>
        <div className="bg-white rounded-lg shadow-md p-8">
          <p className="text-xl mb-6">Your wishlist is empty</p>
          <Link to="/products">
            <Button variant="primary">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-10">Your Wishlist</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg">
            <Link to={`/product/${item.id}`}>
              <div className="h-64 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            </Link>
            <div className="p-5">
              <Link to={`/product/${item.id}`}>
                <h2 className="text-xl font-semibold mb-2 hover:text-gray-700">{item.name}</h2>
              </Link>
              <p className="text-gray-600 mb-2 line-clamp-2">{item.description}</p>
              <div className="flex justify-between items-center mt-4">
                <span className="text-2xl font-bold">${item.price.toFixed(2)}</span>
                <div className="space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => handleRemoveFromWishlist(item.id)}
                    className="px-3 py-1"
                  >
                    Remove
                  </Button>
                  <Button 
                    variant="primary" 
                    onClick={() => handleAddToCart(item)}
                    className="px-3 py-1"
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
