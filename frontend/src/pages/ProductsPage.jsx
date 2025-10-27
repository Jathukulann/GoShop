import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { getProducts, setFilters, clearFilters, reset } from '../redux/slices/productSlice';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';

const ProductsPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { products, filters, totalProducts, totalPages, currentPage, isLoading, isError, message } =
    useSelector((state) => state.products);

  // Parse URL query parameters and fetch products
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const urlFilters = {};

    if (searchParams.get('category')) {
      urlFilters.category = searchParams.get('category');
    }
    if (searchParams.get('search')) {
      urlFilters.search = searchParams.get('search');
    }
    if (searchParams.get('size')) {
      urlFilters.size = searchParams.get('size');
    }
    if (searchParams.get('minPrice')) {
      urlFilters.minPrice = searchParams.get('minPrice');
    }
    if (searchParams.get('maxPrice')) {
      urlFilters.maxPrice = searchParams.get('maxPrice');
    }

    // Merge URL filters with existing filters and fetch products
    const finalFilters = Object.keys(urlFilters).length > 0 ? { ...filters, ...urlFilters } : filters;

    // Set filters in Redux if URL has filters
    if (Object.keys(urlFilters).length > 0) {
      dispatch(setFilters(urlFilters));
    }

    // Fetch products with merged filters
    dispatch(getProducts({ ...finalFilters, page: currentPage, limit: 10 }));

    return () => {
      dispatch(reset());
    };
  }, [location.search, dispatch]);

  // Fetch products when filters change (from FilterBar/SearchBar)
  useEffect(() => {
    // Only fetch if location.search is empty (no URL params)
    // This prevents double fetching when URL params are present
    if (!location.search) {
      dispatch(getProducts({ ...filters, page: currentPage, limit: 10 }));
    }
  }, [filters, currentPage]);

  const handleSearch = (searchTerm) => {
    dispatch(setFilters({ search: searchTerm }));
  };

  const handleFilterChange = (newFilters) => {
    dispatch(setFilters(newFilters));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  const handlePageChange = (page) => {
    dispatch(getProducts({ ...filters, page, limit: 10 }));
  };

  if (isLoading) {
    return (
      <div className="container">
        <div className="loading">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="products-page-header">
        <h1>Shop All Products</h1>
        <SearchBar onSearch={handleSearch} initialValue={filters.search} />
      </div>

      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {isError && <div className="error-message">{message}</div>}

      <div className="products-header">
        <p className="results-count">
          {totalProducts} {totalProducts === 1 ? 'product' : 'products'} found
        </p>
      </div>

      {products.length === 0 ? (
        <div className="no-products">
          <p>No products found matching your criteria.</p>
          <button onClick={handleClearFilters}>Clear Filters</button>
        </div>
      ) : (
        <>
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="page-info">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductsPage;
