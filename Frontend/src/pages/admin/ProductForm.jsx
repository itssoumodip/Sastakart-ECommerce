import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, X, Upload, Package, Save, Eye, Trash2, Edit3 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { getAuthToken, getAuthHeaders } from '../../utils/auth';

function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  
  // Watch values for dynamic UI updates
  const currentCategory = watch('category');
  
  // Categories and status options based on the backend model
  const categories = [
    'Electronics',
    'Clothing',
    'Home & Kitchen',
    'Beauty & Personal Care',
    'Books',
    'Sports & Outdoors',
    'Toys & Games',
    'Health & Wellness',
    'Jewelry',
    'Automotive',
    'Others'
  ];
  
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
  };
  useEffect(() => {
    if (isEditMode) {
      const fetchProductData = async () => {
        try {
          setLoading(true);
          const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products/${id}`, {
            headers: {
              ...getAuthHeaders()
            }
          });
          
          if (!response.ok) {
            throw new Error('Failed to fetch product details');
          }
          
          const { product } = await response.json();
          
          // Set form values
          setValue('name', product.title);
          setValue('description', product.description);
          setValue('price', product.price);
          setValue('salePrice', product.discountPrice);
          setValue('category', product.category);
          setValue('brand', product.brand);
          setValue('inventory', product.stock);
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
  }, [isEditMode, id, navigate, setValue]);  const handleImageUpload = async (e) => {
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

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (uploadedImages.length === 0) {
        toast.error('Please upload at least one product image');
        return;
      }

      const productData = {
        title: data.name,
        description: data.description,
        price: parseFloat(data.price),
        discountPrice: data.salePrice ? parseFloat(data.salePrice) : null,
        images: uploadedImages,
        category: data.category,
        brand: data.brand || 'Generic',
        stock: parseInt(data.inventory) || 0,
        features: data.features ? data.features.split(',').map(f => f.trim()) : []
      };

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
          
          <div className="flex items-center gap-3">
            <motion.button
              type="button"
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
                      {...register('name', { required: 'Product name is required' })}
                      className="input"
                      placeholder="Enter product name"
                    />
                    {errors.name && (
                      <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SKU
                    </label>
                    <input
                      type="text"
                      {...register('sku')}
                      className="input"
                      placeholder="Product SKU"
                    />
                  </div>

                  <div>
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
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      {...register('salePrice')}
                      className="input"
                      placeholder="0.00"
                    />
                  </div>                  <div>
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
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      {...register('category', { required: 'Category is required' })}
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
                      {...register('inventory', { required: 'Stock quantity is required' })}
                      className="input"
                      placeholder="0"
                    />
                    {errors.inventory && (
                      <p className="text-red-600 text-sm mt-1">{errors.inventory.message}</p>
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

              {/* SEO */}
              <div className="card p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  SEO
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meta Title
                    </label>
                    <input
                      type="text"
                      {...register('metaTitle')}
                      className="input"
                      placeholder="SEO title"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meta Description
                    </label>
                    <textarea
                      {...register('metaDescription')}
                      rows={3}
                      className="input"
                      placeholder="SEO description"
                    />
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="card p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Quick Actions
                </h2>
                
                <div className="space-y-3">
                  <motion.button
                    type="button"
                    className="w-full btn-outline text-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Duplicate Product
                  </motion.button>
                  
                  <motion.button
                    type="button"
                    className="w-full btn-outline text-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Export Data
                  </motion.button>
                  
                  {isEditMode && (
                    <motion.button
                      type="button"
                      className="w-full text-red-600 border border-red-200 hover:bg-red-50 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Trash2 className="h-4 w-4 inline mr-2" />
                      Delete Product
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

export default ProductForm;
