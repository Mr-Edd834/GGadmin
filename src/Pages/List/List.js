import React, { useState, useEffect } from 'react'
import './List.css'
import { Utensils, Trash2, Loader2, Clock } from 'lucide-react'
import { foodAPI } from '../../utils/api'
import { toast } from 'react-toastify'

const List = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchFoodItems();
  }, []);

  const fetchFoodItems = async () => {
    try {
      setLoading(true);
      const response = await foodAPI.listFood();
      if (response.success) {
        setFoodItems(response.data);
      }
    } catch (error) {
      console.error('Error fetching food items:', error);
      toast.error('Failed to load food items');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        setDeletingId(id);
        const response = await foodAPI.removeFood(id);
        if (response.success) {
          toast.success('Item deleted successfully');
          setFoodItems(foodItems.filter(item => item._id !== id));
        } else {
          toast.error(response.message || 'Failed to delete item');
        }
      } catch (error) {
        console.error('Error deleting item:', error);
        toast.error('Failed to delete item');
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <div className="list-container">
      <div className="list-header">
        <h1>Your Menu</h1>
        <p>Manage all your delicious food items</p>
      </div>
      
      <div className="list-content">
        {loading ? (
          <div className="list-loading">
            <Loader2 size={48} className="spinner" color="#ff5252" />
            <p>Loading menu items...</p>
          </div>
        ) : foodItems.length === 0 ? (
          <div className="list-empty">
            <div className="list-empty-icon">
              <Utensils size={64} color="#ddd" />
            </div>
            <h3>No items yet</h3>
            <p>Start adding products to see them here</p>
          </div>
        ) : (
          <div className="list-grid">
            {foodItems.map((item) => (
              <div key={item._id} className="food-card">
                <div className="food-image">
                  <img src={foodAPI.getImageURL(item.image)} alt={item.name} />
                  <span className="food-category-badge">{item.category}</span>
                </div>
                <div className="food-details">
                  <h3>{item.name}</h3>
                  <p className="food-category-label">
                    <Utensils size={14} />
                    {item.category}
                  </p>
                  {item.prepTime && (
                    <p className="food-preptime-label">
                      <Clock size={14} />
                      {item.prepTime}
                    </p>
                  )}
                  <p className="food-description">{item.description}</p>
                  <div className="food-info">
                    <span className="food-price">KSH {item.price}</span>
                  </div>
                </div>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(item._id)}
                  disabled={deletingId === item._id}
                >
                  {deletingId === item._id ? (
                    <Loader2 size={18} className="spinner" />
                  ) : (
                    <Trash2 size={18} />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default List;