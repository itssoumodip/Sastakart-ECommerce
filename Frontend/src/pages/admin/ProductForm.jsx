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
          'https://placehold.co/600x400/black/white?text=Headphones+1',
          'https://placehold.co/600x400/black/white?text=Headphones+2'
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
      // Prepare complete product data with images and variants
      const productData = {
        ...data,
        images: uploadedImages,
        // Include other data as needed
      };
      
      // In a real application, you would make an API call here
      console.log('Submitting product data:', productData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(isEditMode ? 'Product updated successfully' : 'Product created successfully');
      navigate('/admin/products');
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Add empty variant handler
  const addVariant = () => {
    setSelectedVariant({
      id: Date.now(),
      color: '',
      size: '',
      price: 0,
      inventory: 0
    });
  };

  return (
    <motion.div 
      className="min-h-screen bg-black text-white"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="container mx-auto px-4 py-8">
        <Helmet>
          <title>{isEditMode ? 'Edit Product' : 'Add New Product'} | Admin Dashboard</title>
        </Helmet>

        {/* Header */}
        <motion.div 
          className="flex items-center justify-between mb-8"
          variants={itemVariants}
        >
          <div className="flex items-center gap-4">
            <motion.button
              onClick={() => navigate('/admin/products')}
              className="p-2 text-white border-2 border-white hover:bg-white hover:text-black transition-colors duration-200"
              whileHover={{ scale: 1.05, x: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="h-5 w-5" />
            </motion.button>
            <div>
              <h1 className="text-4xl font-mono font-bold text-white flex items-center gap-3 tracking-widest uppercase">
                <Package className="h-8 w-8 text-white" />
                [ {isEditMode ? 'EDIT PRODUCT' : 'NEW PRODUCT'} ]
              </h1>
              <p className="text-gray-400 mt-2 font-mono">
                {isEditMode ? 'Update product information and settings' : 'Create a new product for your store'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <motion.button
              type="button"
              className="px-4 py-2 text-black bg-white border-2 border-white font-mono uppercase tracking-wider hover:bg-black hover:text-white transition-colors duration-200 flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Eye className="h-4 w-4" />
              Preview
            </motion.button>
            <motion.button
              onClick={handleSubmit(onSubmit)}
              disabled={loading}
              className="px-6 py-2 bg-black text-white border-4 border-white font-mono uppercase tracking-wider hover:bg-white hover:text-black transition-colors duration-200 flex items-center gap-2 font-medium disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Save className="h-4 w-4" />
              {loading ? 'SAVING...' : isEditMode ? 'UPDATE' : 'CREATE'}
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
              <div className="bg-black border-4 border-white p-6">
                <h2 className="text-xl font-bold text-white mb-6 font-mono uppercase tracking-wider flex items-center gap-2">
                  <Edit3 className="h-5 w-5 text-white" />
                  [ BASIC INFORMATION ]
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2 font-mono uppercase tracking-wider">
                      Product Name *
                    </label>
                    <input
                      {...register('name', { required: 'Product name is required' })}
                      className="w-full px-4 py-3 border-2 border-white bg-black text-white font-mono focus:ring-2 focus:ring-white focus:border-white transition-all duration-200"
                      placeholder="Enter product name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-white">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white mb-2 font-mono uppercase tracking-wider">
                      SKU *
                    </label>
                    <input
                      {...register('sku', { required: 'SKU is required' })}
                      className="w-full px-4 py-3 border-2 border-white bg-black text-white font-mono focus:ring-2 focus:ring-white focus:border-white transition-all duration-200"
                      placeholder="Enter SKU"
                    />
                    {errors.sku && (
                      <p className="mt-1 text-sm text-white">{errors.sku.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white mb-2 font-mono uppercase tracking-wider">
                      Regular Price *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      {...register('price', { required: 'Price is required', min: 0 })}
                      className="w-full px-4 py-3 border-2 border-white bg-black text-white font-mono focus:ring-2 focus:ring-white focus:border-white transition-all duration-200"
                      placeholder="0.00"
                    />
                    {errors.price && (
                      <p className="mt-1 text-sm text-white">{errors.price.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white mb-2 font-mono uppercase tracking-wider">
                      Sale Price
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      {...register('salePrice', { min: 0 })}
                      className="w-full px-4 py-3 border-2 border-white bg-black text-white font-mono focus:ring-2 focus:ring-white focus:border-white transition-all duration-200"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white mb-2 font-mono uppercase tracking-wider">
                      Category *
                    </label>
                    <select
                      {...register('category', { required: 'Category is required' })}
                      className="w-full px-4 py-3 border-2 border-white bg-black text-white font-mono focus:ring-2 focus:ring-white focus:border-white transition-all duration-200"
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="mt-1 text-sm text-white">{errors.category.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white mb-2 font-mono uppercase tracking-wider">
                      Stock Quantity *
                    </label>
                    <input
                      type="number"
                      {...register('inventory', { required: 'Stock quantity is required', min: 0 })}
                      className="w-full px-4 py-3 border-2 border-white bg-black text-white font-mono focus:ring-2 focus:ring-white focus:border-white transition-all duration-200"
                      placeholder="0"
                    />
                    {errors.inventory && (
                      <p className="mt-1 text-sm text-white">{errors.inventory.message}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-white mb-2 font-mono uppercase tracking-wider">
                      Product Status
                    </label>
                    <div className="flex gap-4 items-center">
                      {statusOptions.map(status => (
                        <label key={status} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            value={status}
                            {...register('status', { required: true })}
                            className="w-4 h-4 text-white bg-black border-white focus:ring-white"
                          />
                          <span className="text-white font-mono">{status}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-white mb-2 font-mono uppercase tracking-wider">
                      Description *
                    </label>
                    <textarea
                      {...register('description', { required: 'Description is required' })}
                      rows={6}
                      className="w-full px-4 py-3 border-2 border-white bg-black text-white font-mono focus:ring-2 focus:ring-white focus:border-white transition-all duration-200"
                      placeholder="Enter product description"
                    ></textarea>
                    {errors.description && (
                      <p className="mt-1 text-sm text-white">{errors.description.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Product Images */}
              <div className="bg-black border-4 border-white p-6">
                <h2 className="text-xl font-bold text-white mb-6 font-mono uppercase tracking-wider flex items-center gap-2">
                  <Upload className="h-5 w-5 text-white" />
                  [ PRODUCT IMAGES ]
                </h2>
                
                {/* Image Upload */}
                <div className="mb-6">
                  <label 
                    className="w-full h-32 border-2 border-dashed border-white flex items-center justify-center cursor-pointer hover:bg-gray-900 transition-colors duration-200"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    <div className="text-center">
                      <Upload className="h-8 w-8 text-white mx-auto mb-2" />
                      <p className="text-white font-mono uppercase tracking-wider">DRAG & DROP OR CLICK TO UPLOAD</p>
                    </div>
                  </label>
                </div>
                
                {/* Image Preview */}
                {uploadedImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {uploadedImages.map((image, index) => (
                      <div key={index} className="relative group border-2 border-white">
                        <img 
                          src={image} 
                          alt={`Product preview ${index + 1}`} 
                          className="w-full h-32 object-cover"
                        />
                        <button 
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 p-1 bg-black text-white border border-white hover:bg-white hover:text-black transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Sidebar Information */}
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="bg-black border-4 border-white p-6">
                <h2 className="text-xl font-bold text-white mb-6 font-mono uppercase tracking-wider">
                  [ SPECIFICATIONS ]
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-semibold text-white font-mono uppercase tracking-wider">Key</label>
                      <label className="block text-sm font-semibold text-white font-mono uppercase tracking-wider">Value</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        placeholder="e.g. Weight"
                        className="flex-1 px-4 py-2 border-2 border-white bg-black text-white font-mono focus:ring-2 focus:ring-white focus:border-white"
                      />
                      <input
                        placeholder="e.g. 2.5 lbs"
                        className="flex-1 px-4 py-2 border-2 border-white bg-black text-white font-mono focus:ring-2 focus:ring-white focus:border-white"
                      />
                      <button
                        type="button"
                        className="p-2 border-2 border-white text-white hover:bg-white hover:text-black transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-black border-4 border-white p-6">
                <h2 className="text-xl font-bold text-white mb-6 font-mono uppercase tracking-wider">
                  [ PRODUCT VARIANTS ]
                </h2>
                
                <button
                  type="button"
                  onClick={addVariant}
                  className="w-full py-3 border-2 border-white bg-black text-white font-mono hover:bg-white hover:text-black transition-colors flex items-center justify-center gap-2 mb-4"
                >
                  <Plus className="h-4 w-4" />
                  ADD VARIANT
                </button>
                
                {/* Show basic variant info */}
                {selectedVariant && (
                  <div className="border-2 border-white p-4 mt-4">
                    <h3 className="font-mono uppercase tracking-wider text-white mb-4 border-b border-white pb-2">VARIANT DETAILS</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-mono uppercase tracking-wider text-white mb-1">Color</label>
                        <input
                          value={selectedVariant.color}
                          onChange={(e) => setSelectedVariant({...selectedVariant, color: e.target.value})}
                          className="w-full px-3 py-2 border-2 border-white bg-black text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-mono uppercase tracking-wider text-white mb-1">Size</label>
                        <input
                          value={selectedVariant.size}
                          onChange={(e) => setSelectedVariant({...selectedVariant, size: e.target.value})}
                          className="w-full px-3 py-2 border-2 border-white bg-black text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-mono uppercase tracking-wider text-white mb-1">Price</label>
                        <input
                          type="number"
                          value={selectedVariant.price}
                          onChange={(e) => setSelectedVariant({...selectedVariant, price: parseFloat(e.target.value)})}
                          className="w-full px-3 py-2 border-2 border-white bg-black text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-mono uppercase tracking-wider text-white mb-1">Inventory</label>
                        <input
                          type="number"
                          value={selectedVariant.inventory}
                          onChange={(e) => setSelectedVariant({...selectedVariant, inventory: parseInt(e.target.value)})}
                          className="w-full px-3 py-2 border-2 border-white bg-black text-white font-mono"
                        />
                      </div>
                      
                      <div className="flex justify-end pt-2 border-t border-white space-x-2">
                        <button
                          type="button"
                          onClick={() => setSelectedVariant(null)}
                          className="px-3 py-2 border-2 border-white font-mono text-white hover:bg-white hover:text-black transition-colors"
                        >
                          CANCEL
                        </button>
                        <button
                          type="button"
                          className="px-3 py-2 bg-white text-black border-2 border-white font-mono hover:bg-black hover:text-white transition-colors"
                        >
                          SAVE VARIANT
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

export default ProductForm;
