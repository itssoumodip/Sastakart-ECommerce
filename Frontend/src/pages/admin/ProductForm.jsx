import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, X, Upload, Package, Save, Eye, Trash2, Edit3, ShoppingCart, Heart } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { getAuthToken, getAuthHeaders } from '../../utils/auth';

function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();  const [loading, setLoading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [showPreview, setShowPreview] = useState(false);// Watch values for dynamic UI updates
  const currentCategory = watch('category');
  const currentSubcategory = watch('subcategory');
  const currentProductType = watch('productType');
  // Categories, subcategories and product types based on the backend model
  const categoryTree = {
    'Electronics': {
      'Smartphones': ['iPhone', 'Android', 'Feature Phones'],
      'Laptops': ['Gaming', 'Business', 'Student', 'Convertible'],
      'Audio': ['Headphones', 'Speakers', 'Earbuds', 'Microphones'],
      'Cameras': ['DSLR', 'Mirrorless', 'Point & Shoot', 'Action Cameras'],
      'Accessories': ['Chargers', 'Cases', 'Screen Protectors', 'Stands']
    },
    'Clothing': {
      'Men': ['T-shirts', 'Shirts', 'Pants', 'Jeans', 'Jackets', 'Sweaters', 'Underwear', 'Socks'],
      'Women': ['Tops', 'Dresses', 'Skirts', 'Pants', 'Jeans', 'Jackets', 'Lingerie', 'Activewear'],
      'Kids': ['Boys', 'Girls', 'Infants', 'Shoes', 'School Wear']
    },
    'Home & Kitchen': {
      'Furniture': ['Living Room', 'Bedroom', 'Dining', 'Office'],
      'Cookware': ['Pots & Pans', 'Kitchen Tools', 'Bakeware', 'Knives'],
      'Bedding': ['Sheets', 'Pillows', 'Comforters', 'Mattresses'],
      'Decor': ['Wall Art', 'Lighting', 'Rugs', 'Curtains']
    },    'Beauty & Personal Care': {
      'Skincare': ['Cleansers', 'Moisturizers', 'Serums', 'Face Masks', 'Sunscreen'],
      'Makeup': ['Face', 'Eyes', 'Lips', 'Nails', 'Brushes'],
      'Haircare': ['Shampoo', 'Conditioner', 'Styling', 'Hair Color', 'Treatments'],
      'Fragrance': ['Women\'s Perfume', 'Men\'s Cologne', 'Gift Sets']
    },
    'Books': {
      'Fiction': ['Novels', 'Fantasy', 'Sci-Fi', 'Mystery', 'Romance'],
      'Non-fiction': ['Biography', 'Self-Help', 'History', 'Business', 'Travel'],
      'Academic': ['Textbooks', 'Reference', 'Study Guides', 'Professional'],
      'Children': ['Picture Books', 'Middle Grade', 'Young Adult']
    },
    'Sports & Outdoors': {
      'Fitness': ['Exercise Equipment', 'Yoga', 'Weights', 'Fitness Trackers'],
      'Camping': ['Tents', 'Sleeping Bags', 'Backpacks', 'Camp Kitchen'],
      'Sports Equipment': ['Team Sports', 'Individual Sports', 'Water Sports'],
      'Activewear': ['Running', 'Training', 'Swimwear', 'Accessories']
    },
    'Toys & Games': {
      'Board Games': ['Strategy', 'Family', 'Card Games', 'Classic Games'],
      'Educational': ['STEM Toys', 'Learning Kits', 'Arts & Crafts', 'Puzzles'],
      'Action Figures': ['Superheroes', 'Collectibles', 'Dolls'],
      'Outdoor Play': ['Sports Toys', 'Playsets', 'Water Toys', 'Ride-Ons']
    },
    'Health & Wellness': {
      'Supplements': ['Vitamins', 'Protein', 'Weight Management', 'Herbal'],
      'Personal Care': ['Oral Care', 'Bath & Body', 'Feminine Care'],
      'Medical Supplies': ['First Aid', 'Health Monitors', 'Mobility Aids']
    },
    'Jewelry': {
      'Necklaces': ['Pendants', 'Chains', 'Chokers', 'Statement'],
      'Earrings': ['Studs', 'Hoops', 'Drops', 'Cuffs'],
      'Rings': ['Engagement', 'Wedding', 'Fashion', 'Stackable'],
      'Bracelets': ['Bangles', 'Chain', 'Cuffs', 'Charm']
    },    'Automotive': {
      'Interior': ['Seat Covers', 'Floor Mats', 'Organizers', 'Electronics'],
      'Exterior': ['Car Care', 'Covers', 'Accessories'],
      'Tools': ['Hand Tools', 'Diagnostic', 'Specialty Tools'],
      'Parts': ['Replacement Parts', 'Performance', 'Accessories']
    },
    'Others': {}
  };
  
  // Flat list of categories for form select
  const categories = Object.keys(categoryTree);
  
  const statusOptions = ['Active', 'Draft', 'Out of Stock'];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };  useEffect(() => {
    if (isEditMode) {
      const fetchProductData = async () => {
        try {
          setLoading(true);
          const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products/${id}`, {
            headers: {
              ...getAuthHeaders()
            },
            credentials: 'include'
          });
          if (!response.ok) {
            throw new Error('Failed to fetch product details');
          }
          const { product } = await response.json();          setValue('title', product.title); // Use 'title' for both edit and submit
          setValue('description', product.description);
          setValue('price', product.price);
          setValue('salePrice', product.discountPrice);
          setValue('category', product.category);
          setValue('subcategory', product.subcategory || '');
          setValue('productType', product.productType || '');
          setValue('brand', product.brand);
          setValue('stock', product.stock); // Use 'stock' for both edit and submit
          setValue('status', product.stock > 0 ? (product.stock < 10 ? 'Low Stock' : 'Active') : 'Out of Stock');
          setValue('features', product.features?.join(', '));
          setUploadedImages(product.images || []);
        } catch (error) {
          console.error('Error fetching product details:', error);
          toast.error('Failed to load product details');
          navigate('/admin/products');
        } finally {
          setLoading(false);
        }
      };
      fetchProductData();
    }
  }, [isEditMode, id, navigate, setValue]);const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    setLoading(true);
    
    try {
      // Validate file sizes and types
      const maxSize = 5 * 1024 * 1024; // 5MB
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      
      for (const file of files) {
        if (file.size > maxSize) {
          throw new Error(`File ${file.name} is too large. Maximum size is 5MB.`);
        }
        if (!allowedTypes.includes(file.type)) {
          throw new Error(`File ${file.name} has invalid type. Only JPEG, PNG, GIF, and WebP are allowed.`);
        }
      }
      
      // Convert files to base64
      const base64Images = await Promise.all(
        files.map(file => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
          });
        })
      );

      // Upload to server
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/upload/products/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        credentials: 'include',
        body: JSON.stringify({ images: base64Images })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to upload images');
      }
      
      const data = await response.json();
      setUploadedImages(prev => [...prev, ...data.images]);
      toast.success('Images uploaded successfully!');
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error(error.message || 'Failed to upload images');
    } finally {
      setLoading(false);
    }
  };
  const removeImage = (index) => {
    setUploadedImages(images => images.filter((_, i) => i !== index));
  };

  const handlePreview = () => {
    const formData = watch();
    
    // Validate that we have at least basic product info for preview
    if (!formData.title || !formData.price) {
      toast.error('Please enter at least product name and price to preview');
      return;
    }
    
    if (uploadedImages.length === 0) {
      toast.error('Please upload at least one image to preview');
      return;
    }
    
    setShowPreview(true);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (uploadedImages.length === 0) {
        toast.error('Please upload at least one product image');
        return;
      }
      
      // Ensure all category data is properly formatted
      const productData = {
        title: data.title,
        description: data.description,
        price: parseFloat(data.price),
        discountPrice: data.salePrice ? parseFloat(data.salePrice) : undefined,
        images: uploadedImages,
        category: data.category,
        subcategory: data.subcategory || '',
        productType: data.productType || '',
        brand: data.brand || 'Generic',
        stock: parseInt(data.stock) || 0,
        features: data.features ? data.features.split(',').map(f => f.trim()).filter(f => f) : []
      };
      
      // Log the category data being submitted
      console.log('Submitting product with categories:', {
        category: productData.category,
        subcategory: productData.subcategory,
        productType: productData.productType
      });

      const url = isEditMode 
        ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products/${id}`
        : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products`;

      const response = await fetch(url, {
        method: isEditMode ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        credentials: 'include',
        body: JSON.stringify(productData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save product');
      }

      toast.success(isEditMode ? 'Product updated successfully!' : 'Product created successfully!');
      navigate('/admin/products');
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(error.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };
  // Test authentication
  const testAuth = async () => {
    try {
      const token = getAuthToken();
      console.log('Testing auth with token:', !!token);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/upload/test`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        }
      });
      
      const data = await response.json();
      console.log('Auth test response:', data);
      
      if (response.ok) {
        toast.success(`Auth working! User: ${data.user.email} (${data.user.role})`);
      } else {
        toast.error(`Auth failed: ${data.message}`);
      }
    } catch (error) {
      console.error('Auth test error:', error);
      toast.error('Auth test failed');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          ...getAuthHeaders()
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete product');
      }
      
      toast.success('Product deleted successfully');
      navigate('/admin/products');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error(error.message || 'Failed to delete product');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (currentCategory) {
      console.log('Current Category:', currentCategory);
      console.log('Available subcategories:', Object.keys(categoryTree[currentCategory] || {}));
    }
  }, [currentCategory]);
  
  useEffect(() => {
    if (currentCategory && currentSubcategory) {
      console.log('Current Subcategory:', currentSubcategory);
      console.log('Available product types:', categoryTree[currentCategory]?.[currentSubcategory] || []);
      console.log('Product types array?', Array.isArray(categoryTree[currentCategory]?.[currentSubcategory]));
      console.log('Full category tree structure:', categoryTree);
    }
  }, [currentCategory, currentSubcategory]);

  // ProductPreview Modal Component
  const ProductPreview = () => {
    const formData = watch();
    
    const previewProduct = {
      _id: 'preview',
      title: formData.title || 'Product Name',
      description: formData.description || 'Product description...',
      price: parseFloat(formData.price) || 0,
      discountPrice: formData.salePrice ? parseFloat(formData.salePrice) : null,
      images: uploadedImages,
      category: formData.category || '',
      subcategory: formData.subcategory || '',
      productType: formData.productType || '',
      brand: formData.brand || '',
      stock: parseInt(formData.stock) || 0,
      rating: 0,
      numReviews: 0,
      features: formData.features ? formData.features.split(',').map(f => f.trim()).filter(f => f) : []
    };

    // Add rating display component
    const RatingDisplay = ({ rating, numReviews }) => {
      return (
        <div className="flex items-center gap-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${
                  star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500">
            {numReviews > 0 ? `(${numReviews} reviews)` : 'No reviews yet'}
          </span>
        </div>
      );
    };

    return (
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Product Preview</h2>
                  <button
                    onClick={() => setShowPreview(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <p className="text-gray-600 mt-1">This is how your product will appear to customers</p>
              </div>
              
              <div className="p-6">
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Product Images */}
                  <div>
                    <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden mb-4">
                      {uploadedImages.length > 0 ? (
                        <img
                          src={uploadedImages[0]}
                          alt="Product preview"
                          className="w-full h-full object-scale-down"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Package className="h-16 w-16" />
                        </div>
                      )}
                    </div>
                    
                    {uploadedImages.length > 1 && (
                      <div className="flex gap-2 overflow-x-auto">
                        {uploadedImages.slice(1, 5).map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`Preview ${index + 2}`}
                            className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                          />
                        ))}
                        {uploadedImages.length > 5 && (
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-sm text-gray-500">
                            +{uploadedImages.length - 5}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Product Info */}
                  <div>
                    <div className="mb-4">
                      {previewProduct.category && (
                        <p className="text-sm text-gray-500 mb-2">
                          {previewProduct.category}
                          {previewProduct.subcategory && ` › ${previewProduct.subcategory}`}
                          {previewProduct.productType && ` › ${previewProduct.productType}`}
                        </p>
                      )}
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {previewProduct.title}
                      </h1>
                      {previewProduct.brand && (
                        <p className="text-lg text-gray-600 mb-4">by {previewProduct.brand}</p>
                      )}
                      
                      {/* Rating display */}
                      <RatingDisplay rating={previewProduct.rating} numReviews={previewProduct.numReviews} />
                    </div>
                    
                    {/* Price */}
                    <div className="mb-6">
                      {previewProduct.discountPrice && previewProduct.discountPrice < previewProduct.price ? (
                        <div className="flex items-center gap-3">
                          <span className="text-3xl font-bold text-gray-900">
                            ₹{previewProduct.discountPrice.toFixed(2)}
                          </span>
                          <span className="text-xl text-gray-500 line-through">
                            ₹{previewProduct.price.toFixed(2)}
                          </span>
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">
                            {Math.round(((previewProduct.price - previewProduct.discountPrice) / previewProduct.price) * 100)}% OFF
                          </span>
                        </div>
                      ) : (
                        <span className="text-3xl font-bold text-gray-900">
                          ₹{previewProduct.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                    
                    {/* Stock Status */}
                    <div className="mb-6">
                      {previewProduct.stock > 0 ? (
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-green-700 font-medium">
                            {previewProduct.stock > 10 ? 'In Stock' : `Only ${previewProduct.stock} left`}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span className="text-red-700 font-medium">Out of Stock</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Description */}
                    {previewProduct.description && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                        <p className="text-gray-600 leading-relaxed">
                          {previewProduct.description}
                        </p>
                      </div>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        disabled={previewProduct.stock === 0}
                        className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-colors ${
                          previewProduct.stock === 0
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-black text-white hover:bg-gray-800'
                        }`}
                      >
                        <ShoppingCart className="w-5 h-5 inline mr-2" />
                        Add to Cart
                      </button>
                      <button className="p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                        <Heart className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  return (
    <motion.div 
      className="min-h-screen bg-white"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="container mx-auto px-4 py-8">
        <Helmet>
          <title>{isEditMode ? 'Edit Product' : 'Create Product'} | Admin Dashboard</title>
        </Helmet>

        {/* Header */}
        <motion.div 
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4"
          variants={itemVariants}
        >
          <div className="flex items-center gap-4">
            <motion.button
              onClick={() => navigate('/admin/products')}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              whileHover={{ scale: 1.05, x: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="h-5 w-5" />
            </motion.button>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
                <Package className="h-8 w-8 text-gray-600" />
                {isEditMode ? 'Edit Product' : 'Create Product'}
              </h1>
              <p className="text-gray-600 mt-2">
                {isEditMode ? 'Update product information and settings' : 'Create a new product for your store'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">            <motion.button
              type="button"
              onClick={handlePreview}
              className="btn-outline flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Eye className="h-4 w-4" />
              Preview
            </motion.button>
            <motion.button
              onClick={handleSubmit(onSubmit)}
              disabled={loading}
              className="btn-primary flex items-center gap-2 disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Save className="h-4 w-4" />
              {loading ? 'Saving...' : isEditMode ? 'Update' : 'Create'}
            </motion.button>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Product Information */}
            <motion.div 
              className="lg:col-span-2 space-y-6"
              variants={itemVariants}
            >
              {/* Basic Information */}
              <div className="card p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Edit3 className="h-5 w-5" />
                  Basic Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      {...register('title', { required: 'Product name is required' })}
                      className="input"
                      placeholder="Enter product name"
                    />
                    {errors.title && (
                      <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
                    )}
                  </div>                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      {...register('price', { required: 'Price is required' })}
                      className="input"
                      placeholder="0.00"
                    />
                    {errors.price && (
                      <p className="text-red-600 text-sm mt-1">{errors.price.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sale Price
                    </label>                    <input
                      type="number"
                      step="0.01"
                      {...register('salePrice', {
                        validate: value => {
                          const price = parseFloat(watch('price') || 0);
                          return !value || parseFloat(value) < price || 'Sale price must be less than regular price';
                        }
                      })}
                      className="input"
                      placeholder="0.00"
                    />
                    {errors.salePrice && (
                      <p className="text-red-600 text-sm mt-1">{errors.salePrice.message}</p>
                    )}
                  </div><div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Brand *
                    </label>
                    <input
                      type="text"
                      {...register('brand', { required: 'Brand is required' })}
                      className="input"
                      placeholder="Enter brand name"
                    />
                    {errors.brand && (
                      <p className="text-red-600 text-sm mt-1">{errors.brand.message}</p>
                    )}
                  </div>                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>                    <select
                      {...register('category', { 
                        required: 'Category is required',
                        onChange: (e) => {
                          // Reset subcategory and product type when category changes
                          setValue('subcategory', '');
                          setValue('productType', '');
                          console.log('Category changed to:', e.target.value);
                        }
                      })}
                      className="input"
                    >
                      <option value="">Select category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="text-red-600 text-sm mt-1">{errors.category.message}</p>
                    )}
                  </div>

                  {/* Subcategory field - only shown when a category that has subcategories is selected */}                  {currentCategory && Object.keys(categoryTree[currentCategory] || {}).length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subcategory
                      </label>                      <select
                        {...register('subcategory', {
                          onChange: (e) => {
                            // Reset product type when subcategory changes
                            setValue('productType', '');
                            console.log('Subcategory changed to:', e.target.value);
                            console.log('Product types available:', categoryTree[currentCategory]?.[e.target.value] || []);
                          }
                        })}
                        className="input"
                      >
                        <option value="">Select subcategory</option>
                        {Object.keys(categoryTree[currentCategory] || {}).map(subcat => (
                          <option key={subcat} value={subcat}>{subcat}</option>
                        ))}
                      </select>
                    </div>
                  )}                  {/* Product Type field - only shown when both category and subcategory are selected */}
                  {currentCategory && currentSubcategory && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Type
                      </label>
                      <select
                        {...register('productType')}
                        className="input"
                      >
                        <option value="">Select product type</option>
                        {(categoryTree[currentCategory]?.[currentSubcategory] || []).map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      {...register('status')}
                      className="input"
                    >
                      {statusOptions.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    {...register('description')}
                    rows={4}
                    className="input"
                    placeholder="Product description..."
                  />
                </div>
              </div>

              {/* Product Images */}
              <div className="card p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Product Images
                </h2>

                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <div className="text-sm text-gray-600 mb-4">
                      <label htmlFor="images" className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer">
                        Click to upload
                      </label>
                      <span> or drag and drop</span>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    <input
                      id="images"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>

                  {uploadedImages.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <AnimatePresence>
                        {uploadedImages.map((image, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="relative group"
                          >
                            <img
                              src={image}
                              alt={`Product ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <motion.button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <X className="h-4 w-4" />
                            </motion.button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Sidebar */}
            <motion.div 
              className="space-y-6"
              variants={itemVariants}
            >
              {/* Inventory */}
              <div className="card p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Inventory
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock Quantity *
                    </label>
                    <input
                      type="number"
                      {...register('stock', { required: 'Inventory is required' })}
                      className="input"
                      placeholder="Enter inventory count"
                    />
                    {errors.stock && (
                      <p className="text-red-600 text-sm mt-1">{errors.stock.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Low Stock Alert
                    </label>
                    <input
                      type="number"
                      {...register('lowStockAlert')}
                      className="input"
                      placeholder="10"
                    />
                  </div>
                </div>
              </div>

              {/* Delete button for edit mode */}
              {isEditMode && (
                <div className="card p-6">
                  <motion.button
                    type="button"
                    onClick={handleDelete}
                    disabled={loading}
                    className="w-full text-red-600 border border-red-200 hover:bg-red-50 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Trash2 className="h-4 w-4 inline mr-2" />
                    {loading ? 'Deleting...' : 'Delete Product'}
                  </motion.button>
                </div>
              )}
            </motion.div>
          </div>
        </form>

        {/* Product Preview Modal */}
        <ProductPreview />
      </div>
    </motion.div>
  );
}

export default ProductForm;
