import { useState } from 'react';

const FilterBar = ({ filters, onFilterChange, onClearFilters }) => {
  const [showFilters, setShowFilters] = useState(true);

  const categories = ['Men', 'Women', 'Kids'];
  const subcategories = {
    Men: ['T-Shirts', 'Shirts', 'Jeans', 'Trousers', 'Jackets', 'Sweaters'],
    Women: ['T-Shirts', 'Tops', 'Dresses', 'Skirts', 'Jeans', 'Jackets'],
    Kids: ['T-Shirts', 'Jeans', 'Shorts', 'Jackets'],
  };
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Top Rated' },
  ];

  const handleChange = (name, value) => {
    onFilterChange({ [name]: value });
  };

  const availableSubcategories = filters.category
    ? subcategories[filters.category] || []
    : [];

  return (
    <div className="filter-bar">
      <div className="filter-header">
        <h3>Filters</h3>
        <button className="toggle-btn" onClick={() => setShowFilters(!showFilters)}>
          {showFilters ? 'Hide' : 'Show'}
        </button>
      </div>

      {showFilters && (
        <div className="filter-content">
          {/* Category */}
          <div className="filter-group">
            <label>Category</label>
            <select
              value={filters.category}
              onChange={(e) => handleChange('category', e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Subcategory */}
          {filters.category && (
            <div className="filter-group">
              <label>Subcategory</label>
              <select
                value={filters.subcategory}
                onChange={(e) => handleChange('subcategory', e.target.value)}
              >
                <option value="">All Subcategories</option>
                {availableSubcategories.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Size */}
          <div className="filter-group">
            <label>Size</label>
            <select value={filters.size} onChange={(e) => handleChange('size', e.target.value)}>
              <option value="">All Sizes</option>
              {sizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div className="filter-group">
            <label>Price Range</label>
            <div className="price-inputs">
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => handleChange('minPrice', e.target.value)}
                min="0"
              />
              <span>-</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => handleChange('maxPrice', e.target.value)}
                min="0"
              />
            </div>
          </div>

          {/* Sort */}
          <div className="filter-group">
            <label>Sort By</label>
            <select value={filters.sort} onChange={(e) => handleChange('sort', e.target.value)}>
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <button className="clear-filters-btn" onClick={onClearFilters}>
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
