import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, X, Upload, Package, Save, Eye, Trash2, Edit3 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

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

  // Sample categories and status options
  const categories = ['Electronics', 'Clothing', 'Accessories', 'Home & Kitchen'];
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
      // In a real application, fetch product data from API
      // For demo purposes, we'll use mock data
      const mockProduct = {
        name: 'Wireless Headphones',
        sku: 'PRD-0001',
        price: 99.99,
        salePrice: 89.99,
        category: 'Electronics',
        description: 'High-quality wireless headphones with noise cancellation.',
        inventory: 45,
        status: 'Active',
        images: [
          'https://placehold.co/600x400/e5e7eb/6b7280?text=Headphones+1',
          'https://placehold.co/600x400/e5e7eb/6b7280?text=Headphones+2'
        ],
        variants: [
          { id: 1, color: 'Black', size: 'One Size', price: 99.99, inventory: 25 },
          { id: 2, color: 'White', size: 'One Size', price: 99.99, inventory: 20 }
        ],
        specifications: [
          { key: 'Battery Life', value: '20 hours' },
          { key: 'Connectivity', value: 'Bluetooth 5.0' }
        ]
      };

      // Set form values
      Object.keys(mockProduct).forEach(key => {
        if (key !== 'images' && key !== 'variants' && key !== 'specifications') {
          setValue(key, mockProduct[key]);
        }
      });
      
      setUploadedImages(mockProduct.images);
    }
  }, [isEditMode, setValue]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // In a real app, you would upload to a service and get URLs back
    // For this demo, we'll create object URLs
    const newImages = files.map(file => 
      URL.createObjectURL(file)
    );
    
    setUploadedImages([...uploadedImages, ...newImages]);
  };

  const removeImage = (index) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Prepare complete product data with images
      const productData = {
        ...data,
        images: uploadedImages
      };

      // In a real app, you would make an API call here
      console.log('Product data:', productData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(isEditMode ? 'Product updated successfully!' : 'Product created successfully!');
      navigate('/admin/products');
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product. Please try again.');
    } finally {
      setLoading(false);
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
