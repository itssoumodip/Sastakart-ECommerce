import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define API URL - in production this would come from environment variables
const API_URL = 'http://localhost:5000/api';

// Async thunk for fetching all products
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ 
    category = '', 
    search = '', 
    sort = '', 
    page = 1, 
    limit = 10,
    minPrice = '',
    maxPrice = '',
    rating = '' 
  }, { rejectWithValue }) => {
    try {
      const queryString = new URLSearchParams({
        category: category || '',
        search: search || '',
        sort: sort || '',
        page,
        limit,
        minPrice: minPrice || '',
        maxPrice: maxPrice || '',
        rating: rating || ''
      }).toString();
      
      const response = await axios.get(`${API_URL}/products?${queryString}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for fetching a single product
export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/products/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  products: [],
  product: null,
  loading: false,
  error: null,
  totalProducts: 0,
  totalPages: 0,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProductError: (state) => {
      state.error = null;
    },
    clearCurrentProduct: (state) => {
      state.product = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.totalProducts = action.payload.totalProducts;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch products';
      })
      
      // Fetch single product
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch product';
      });
  },
});

export const { clearProductError, clearCurrentProduct } = productSlice.actions;

export default productSlice.reducer;
