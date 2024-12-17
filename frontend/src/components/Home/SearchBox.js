import React, { useState, useEffect } from 'react';
import agentObj from '../../agent'; // Import the API agent
import { debounce } from 'lodash'; // Use lodash for debouncing

const SearchBox = () => {
  const [searchTerm, setSearchTerm] = useState(''); // State to store the search input
  const [items, setItems] = useState([]); // State to store the search results
  const [loading, setLoading] = useState(false); // State to handle loading state

  // Debounced function to fetch items based on search term
  const debouncedSearch = debounce(async (term) => {
    if (term.length >= 3) {
      setLoading(true);
      try {
        const result = await agentObj.Items.all(1, term); // Fetch items based on search term
        setItems(result.items); // Update items state with the search results
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setLoading(false);
      }
    } else {
      setItems([]); // Clear results if search term is less than 3 characters
    }
  }, 500); // 500ms debounce delay

  // Handle input change
  const handleInputChange = (e) => {
    setSearchTerm(e.target.value); // Update search term
  };

  // Use effect to trigger debounced search when searchTerm changes
  useEffect(() => {
    debouncedSearch(searchTerm); // Call debouncedSearch whenever the searchTerm changes
    return () => {
      debouncedSearch.cancel(); // Clean up debounce on unmount
    };
  }, [searchTerm]); // Depend on searchTerm to trigger effect

  return (
    <div className="search_box" id="search-box">
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder="What is it you truly desire?"
      />
      <i className="bi bi-search"></i>

      {loading && <div>Loading...</div>} {/* Show loading indicator while fetching */}
      
      <div className="search_results">
        {items.length > 0 ? (
          items.map((item) => (
            <div key={item.slug} className="search_result_item">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))
        ) : (
          <div>No results found</div>
        )}
      </div>
    </div>
  );
};

export default SearchBox;