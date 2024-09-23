import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import axios from 'axios';

const SidebarFilter = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    price: [],
    category: [],
    brand: [],
    rating: null,
    newArrivals: false,
    popularity: false,
    featured: false,
  });

  const priceRanges = [
    { label: '$500 - $1499', min: 500, max: 1499 },
    { label: '$1500 - $2999', min: 1500, max: 2999 },
    { label: '$3000 - $4999', min: 3000, max: 4999 },
    { label: '$5000+', min: 5000, max: Infinity },
  ];

  const categories = ['Earphones', 'Headphones', 'Earbuds', 'Speakers'];
  const brands = ['Boat', 'Oppo', 'JBL', 'OnePlus'];
  const ratings = [1, 2, 3, 4, 5];

  const handleCheckboxChange = (type, value) => {
    setFilters((prevFilters) => {
      const updatedFilters = {
        ...prevFilters,
        [type]: prevFilters[type].includes(value)
          ? prevFilters[type].filter((item) => item !== value)
          : [...prevFilters[type], value],
      };
      return updatedFilters;
    });
  };

  const handleSingleOptionChange = (type, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [type]: value,
    }));
  };

  
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      try {
        const { price, category, brand, rating, newArrivals, popularity, featured } = filters;

        const queryParams = new URLSearchParams();

        if (price.length > 0) {
          const minPrice = Math.min(...price.map((p) => p.min));
          const maxPrice = Math.max(...price.map((p) => p.max));
          queryParams.append('price', `${minPrice},${maxPrice}`);
        }

        if (category.length > 0) {
          queryParams.append('category', category.join(','));
        }

        if (brand.length > 0) {
          queryParams.append('brand', brand.join(','));
        }

        if (rating) {
          queryParams.append('rating', rating);
        }

        if (newArrivals) {
          queryParams.append('newArrivals', newArrivals);
        }

        if (popularity) {
          queryParams.append('popularity', popularity);
        }

        if (featured) {
          queryParams.append('featured', featured);
        }

        const response = await axios.get(`/api/products/filter?${queryParams.toString()}`);
        onFilterChange(response.data);
      } catch (error) {
        console.error('Error fetching filtered products:', error);
      }
    };

    fetchFilteredProducts();
  }, [filters, onFilterChange]);

  const FilterSection = ({ title, children }) => (
    <div className="mb-6">
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      {children}
    </div>
  );

  return (
    <div className="w-64 bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Filters</h2>

      {/* Price Range Filter */}
      <FilterSection title="Price">
        {priceRanges.map((range) => (
          <div key={range.label} className="flex items-center mb-2">
            <input
              type="checkbox"
              id={range.label}
              checked={filters.price.some((p) => p.min === range.min && p.max === range.max)}
              onChange={() => handleCheckboxChange('price', range)}
              className="mr-2"
            />
            <label htmlFor={range.label}>{range.label}</label>
          </div>
        ))}
      </FilterSection>

      {/* Category Filter */}
      <FilterSection title="Category">
        {categories.map((category) => (
          <div key={category} className="flex items-center mb-2">
            <input
              type="checkbox"
              id={category}
              checked={filters.category.includes(category)}
              onChange={() => handleCheckboxChange('category', category)}
              className="mr-2"
            />
            <label htmlFor={category}>{category}</label>
          </div>
        ))}
      </FilterSection>

      {/* Brand Filter */}
      <FilterSection title="Brand">
        {brands.map((brand) => (
          <div key={brand} className="flex items-center mb-2">
            <input
              type="checkbox"
              id={brand}
              checked={filters.brand.includes(brand)}
              onChange={() => handleCheckboxChange('brand', brand)}
              className="mr-2"
            />
            <label htmlFor={brand}>{brand}</label>
          </div>
        ))}
      </FilterSection>

      {/* Ratings Filter */}
      <FilterSection title="Average Rating">
        {ratings.map((rating) => (
          <div key={rating} className="flex items-center mb-2">
            <input
              type="radio"
              id={`rating-${rating}`}
              checked={filters.rating === rating}
              onChange={() => handleSingleOptionChange('rating', rating)}
              className="mr-2"
            />
            <label htmlFor={`rating-${rating}`} className="flex items-center">
              {[...Array(rating)].map((_, index) => (
                <FaStar key={index} className="text-yellow-400 mr-1" />
              ))}
              {rating === 1 ? ' star' : ' stars'} & up
            </label>
          </div>
        ))}
      </FilterSection>

      {/* Other Filters */}
      <FilterSection title="Other Filters">
        <div className="flex items-center mb-2">
          <input
            type="checkbox"
            id="newArrivals"
            checked={filters.newArrivals}
            onChange={() => handleSingleOptionChange('newArrivals', !filters.newArrivals)}
            className="mr-2"
          />
          <label htmlFor="newArrivals">New Arrivals</label>
        </div>
        <div className="flex items-center mb-2">
          <input
            type="checkbox"
            id="popularity"
            checked={filters.popularity}
            onChange={() => handleSingleOptionChange('popularity', !filters.popularity)}
            className="mr-2"
          />
          <label htmlFor="popularity">Most Popular</label>
        </div>
        <div className="flex items-center mb-2">
          <input
            type="checkbox"
            id="featured"
            checked={filters.featured}
            onChange={() => handleSingleOptionChange('featured', !filters.featured)}
            className="mr-2"
          />
          <label htmlFor="featured">Featured</label>
        </div>
      </FilterSection>
    </div>
  );
};

export default SidebarFilter;
