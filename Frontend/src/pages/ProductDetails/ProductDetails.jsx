import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiHeart, FiShare2, FiChevronRight, FiMinus, FiPlus } from 'react-icons/fi';
import { fetchProductById } from '../../store/productSlice';
import { addToCart } from '../../store/cartSlice';
import { addToWishlist } from '../../store/wishlistSlice';
import Rating from '../../components/ui/Rating';
import Button from '../../components/ui/Button';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { product, loading, error } = useSelector((state) => state.products);
  
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
    
    // Reset state when component unmounts
    return () => {
      setQuantity(1);
      setActiveTab('description');
      setActiveImageIndex(0);
    };
  }, [dispatch, id]);
  
  // Handle quantity changes
  const increaseQuantity = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };
  
  const decreaseQuantity = () => {
    setQuantity(prevQuantity => prevQuantity > 1 ? prevQuantity - 1 : 1);
  };
  
  // Handle add to cart
  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({ product, quantity }));
      // Show success toast here
    }
  };
  
  // Handle add to wishlist
  const handleAddToWishlist = () => {
    if (product) {
      dispatch(addToWishlist(product));
      // Show success toast here
    }
  };
  
  // Handle buy now
  const handleBuyNow = () => {
    if (product) {
      dispatch(addToCart({ product, quantity }));
      navigate('/checkout');
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="bg-gray-200 h-8 w-96 mb-6 rounded"></div>
          <div className="flex flex-col md:flex-row gap-10">
            <div className="bg-gray-200 w-full md:w-1/2 h-96 rounded"></div>
            <div className="w-full md:w-1/2 space-y-4">
              <div className="bg-gray-200 h-6 w-full max-w-sm rounded"></div>
              <div className="bg-gray-200 h-4 w-full max-w-xs rounded"></div>
              <div className="bg-gray-200 h-10 w-32 rounded"></div>
              <div className="bg-gray-200 h-40 w-full rounded"></div>
              <div className="flex space-x-4">
                <div className="bg-gray-200 h-12 w-40 rounded"></div>
                <div className="bg-gray-200 h-12 w-40 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Product</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <Button onClick={() => navigate('/products')}>
          Back to Products
        </Button>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/products')}>
          Back to Products
        </Button>
      </div>
    );
  }
  
  // Use demo product for now until we connect to real API
  const demoProduct = {
    id: id,
    title: 'Premium Wireless Headphones',
    price: 199.99,
    rating: 4.5,
    reviewCount: 129,
    description: 'Experience premium sound quality with our wireless headphones. Featuring noise cancellation technology, comfortable ear cups, and a long-lasting battery for all-day listening pleasure.',
    features: [
      'Active Noise Cancellation',
      '30-hour battery life',
      'Premium sound quality',
      'Comfortable over-ear design',
      'Quick charge capability',
      'Bluetooth 5.0 connectivity'
    ],
    specifications: {
      'Brand': 'SoundMaster',
      'Model': 'WH-1000XM5',
      'Color': 'Black',
      'Connectivity': 'Bluetooth 5.0',
      'Battery Life': 'Up to 30 hours',
      'Weight': '250g',
      'Charging Time': '3 hours',
      'Driver Size': '40mm'
    },
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1577174881658-0f30ed549adc?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1579290291737-53c4643d4378?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1575667634682-0b872d9a5399?auto=format&fit=crop&q=80'
    ],
    inStock: true,
    category: 'Electronics',
    tags: ['headphones', 'wireless', 'premium', 'audio'],
    reviews: [
      {
        id: 1,
        userName: 'John D.',
        rating: 5,
        comment: 'Best headphones I have ever owned. The sound quality is incredible and the noise cancellation is top-notch.',
        date: '2025-01-15'
      },
      {
        id: 2,
        userName: 'Sarah M.',
        rating: 4,
        comment: 'Very comfortable for long listening sessions. Battery life is excellent as advertised.',
        date: '2025-02-03'
      }
    ]
  };
  
  const productToDisplay = { ...demoProduct, ...product };
  
  // Breadcrumb data
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Products', url: '/products' },
    { name: productToDisplay.category, url: `/products?category=${encodeURIComponent(productToDisplay.category)}` },
    { name: productToDisplay.title, url: null }
  ];
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm mb-8 overflow-x-auto whitespace-nowrap">
        {breadcrumbs.map((crumb, index) => (
          <div key={index} className="flex items-center">
            {index > 0 && <FiChevronRight className="mx-2 text-gray-400" />}
            {crumb.url ? (
              <a 
                href={crumb.url} 
                className="text-gray-600 hover:text-black"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(crumb.url);
                }}
              >
                {crumb.name}
              </a>
            ) : (
              <span className="text-gray-900 font-medium">{crumb.name}</span>
            )}
          </div>
        ))}
      </div>
      
      <div className="flex flex-col md:flex-row gap-10">
        {/* Product Images */}
        <div className="w-full md:w-1/2">
          <div className="relative aspect-square mb-4 overflow-hidden bg-gray-100 rounded-lg">
            <motion.img
              key={activeImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              src={productToDisplay.images[activeImageIndex]}
              alt={productToDisplay.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            {productToDisplay.images.map((image, index) => (
              <div
                key={index}
                className={`aspect-square cursor-pointer border-2 rounded overflow-hidden ${
                  index === activeImageIndex ? 'border-black' : 'border-transparent'
                }`}
                onClick={() => setActiveImageIndex(index)}
              >
                <img
                  src={image}
                  alt={`${productToDisplay.title} - Image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Product Info */}
        <div className="w-full md:w-1/2">
          <h1 className="text-3xl font-bold mb-2">{productToDisplay.title}</h1>
          
          {/* Rating */}
          <div className="flex items-center mb-4">
            <Rating value={productToDisplay.rating} readOnly />
            <span className="ml-2 text-gray-600">
              ({productToDisplay.reviewCount} {productToDisplay.reviewCount === 1 ? 'review' : 'reviews'})
            </span>
          </div>
          
          {/* Price */}
          <div className="text-2xl font-bold mb-6">${productToDisplay.price.toFixed(2)}</div>
          
          {/* Availability */}
          <div className="mb-6">
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
              productToDisplay.inStock
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {productToDisplay.inStock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
          
          {/* Short Description */}
          <p className="text-gray-600 mb-6">{productToDisplay.description}</p>
          
          {/* Quantity Selector */}
          <div className="flex items-center mb-6">
            <span className="mr-4 font-medium">Quantity:</span>
            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
              <button
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
                className={`px-3 py-2 ${
                  quantity <= 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FiMinus />
              </button>
              <span className="px-4 py-2 border-x border-gray-300 min-w-[40px] text-center">
                {quantity}
              </span>
              <button
                onClick={increaseQuantity}
                className="px-3 py-2 text-gray-600 hover:bg-gray-100"
              >
                <FiPlus />
              </button>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-8">
            <Button
              onClick={handleAddToCart}
              disabled={!productToDisplay.inStock}
              icon={<FiShoppingCart />}
              fullWidth
              className="flex-1"
            >
              Add to Cart
            </Button>
            
            <Button
              onClick={handleBuyNow}
              variant="secondary"
              disabled={!productToDisplay.inStock}
              fullWidth
              className="flex-1"
            >
              Buy Now
            </Button>
            
            <Button
              onClick={handleAddToWishlist}
              variant="ghost"
              icon={<FiHeart />}
              aria-label="Add to wishlist"
              className="w-auto"
            >
              Wishlist
            </Button>
            
            <Button
              onClick={() => {
                navigator.share({
                  title: productToDisplay.title,
                  text: productToDisplay.description,
                  url: window.location.href,
                }).catch((error) => console.log('Sharing failed', error));
              }}
              variant="ghost"
              icon={<FiShare2 />}
              aria-label="Share product"
              className="w-auto"
            >
              Share
            </Button>
          </div>
          
          {/* Product Features */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3">Key Features:</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              {productToDisplay.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
          
          {/* Category & Tags */}
          <div className="mb-4">
            <div className="mb-2">
              <span className="font-medium">Category:</span>{' '}
              <a 
                href={`/products?category=${encodeURIComponent(productToDisplay.category)}`}
                className="text-gray-600 hover:text-black underline"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/products?category=${encodeURIComponent(productToDisplay.category)}`);
                }}
              >
                {productToDisplay.category}
              </a>
            </div>
            
            <div className="flex flex-wrap items-center">
              <span className="font-medium mr-2">Tags:</span>
              {productToDisplay.tags.map((tag, index) => (
                <a
                  key={index}
                  href={`/products?search=${encodeURIComponent(tag)}`}
                  className="bg-gray-100 text-gray-800 text-sm rounded-full px-3 py-1 mr-2 mb-2 hover:bg-gray-200"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/products?search=${encodeURIComponent(tag)}`);
                  }}
                >
                  {tag}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs: Description, Specifications, Reviews */}
      <div className="mt-16">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            <button
              className={`py-4 px-6 text-center font-medium text-sm whitespace-nowrap ${
                activeTab === 'description'
                  ? 'border-b-2 border-black text-black'
                  : 'text-gray-500 hover:text-black'
              }`}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            
            <button
              className={`py-4 px-6 text-center font-medium text-sm whitespace-nowrap ${
                activeTab === 'specifications'
                  ? 'border-b-2 border-black text-black'
                  : 'text-gray-500 hover:text-black'
              }`}
              onClick={() => setActiveTab('specifications')}
            >
              Specifications
            </button>
            
            <button
              className={`py-4 px-6 text-center font-medium text-sm whitespace-nowrap ${
                activeTab === 'reviews'
                  ? 'border-b-2 border-black text-black'
                  : 'text-gray-500 hover:text-black'
              }`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews ({productToDisplay.reviews.length})
            </button>
          </div>
        </div>
        
        <div className="py-8">
          {activeTab === 'description' && (
            <div className="prose max-w-none">
              <p className="mb-4">
                {productToDisplay.description}
              </p>
              <p>
                Experience premium sound quality with our wireless headphones. The active noise cancellation technology blocks out ambient noise, allowing you to focus on your music or calls. The comfortable over-ear design makes them perfect for all-day wear, while the 30-hour battery life ensures you won't run out of power.
              </p>
              <p>
                With quick charge capability, you can get 5 hours of playback from just 10 minutes of charging. The premium materials used in construction ensure durability, while maintaining a lightweight feel. Perfect for travel, work, or everyday use.
              </p>
            </div>
          )}
          
          {activeTab === 'specifications' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <tbody>
                  {Object.entries(productToDisplay.specifications).map(([key, value], index) => (
                    <tr 
                      key={index}
                      className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                    >
                      <td className="py-3 px-4 font-medium">{key}</td>
                      <td className="py-3 px-4 text-gray-700">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {activeTab === 'reviews' && (
            <div>
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-2">Customer Reviews</h3>
                <div className="flex items-center">
                  <Rating value={productToDisplay.rating} readOnly />
                  <span className="ml-2 text-gray-600">Based on {productToDisplay.reviewCount} reviews</span>
                </div>
              </div>
              
              {productToDisplay.reviews.length > 0 ? (
                <div className="space-y-6">
                  {productToDisplay.reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-6">
                      <div className="flex justify-between mb-2">
                        <div className="font-medium">{review.userName}</div>
                        <div className="text-gray-500 text-sm">{review.date}</div>
                      </div>
                      <div className="mb-2">
                        <Rating value={review.rating} size="small" readOnly />
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
              )}
              
              <div className="mt-8">
                <Button>Write a Review</Button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Related Products section would go here */}
    </div>
  );
};

export default ProductDetails;
