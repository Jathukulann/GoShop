import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts, setFilters, clearFilters, reset } from '../redux/slices/productSlice';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';

const ProductsPage = () => {
  const dispatch = useDispatch();
  const { products, filters, totalProducts, totalPages, currentPage, isLoading, isError, message } =
    useSelector((state) => state.products);

  useEffect(() => {
    // Fetch products with current filters
    dispatch(getProducts({ ...filters, page: currentPage, limit: 12 }));

    return () => {
      dispatch(reset());
    };
  }, [dispatch, filters, currentPage]);

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
    dispatch(getProducts({ ...filters, page, limit: 12 }));
  };

  if (isLoading) {
    return (
      <div className="container">
        <div className="loading">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="products-page">
        <h1>Shop All Products</h1>

        <SearchBar onSearch={handleSearch} initialValue={filters.search} />

        <div className="products-layout">
          <aside className="sidebar">
            <FilterBar
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />
          </aside>

          <main className="products-main">
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
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
