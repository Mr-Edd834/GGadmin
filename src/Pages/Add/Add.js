import React, { useState } from 'react'
import './Add.css'
import { ImagePlus, Loader2 } from 'lucide-react'
import LimitedTextarea from '../../Components/Limitwords'
import api, { foodAPI } from '../../utils/api'
import { toast } from 'react-toastify'

const Add = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePriceChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setFormData({ ...formData, price: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDescriptionChange = (value) => {
    setFormData({ ...formData, description: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      toast.error('Please upload a product image');
      return;
    }

    if (!formData.name || !formData.description || !formData.price || !formData.category) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('price', Number(formData.price));
      data.append('category', formData.category);
      data.append('image', image);

      const response = await foodAPI.addFood(data);

      if (response.success) {
        toast.success('Product added successfully! 🎉');
        // Reset form
        setFormData({
          name: '',
          description: '',
          price: '',
          category: '',
        });
        setImage(null);
        setImagePreview(null);
        // Reset file input
        document.getElementById('image').value = '';
      } else {
        toast.error(response.message || 'Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Failed to add product. Please check your backend connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-container">
        <div className="add-header">
          <h1>Add New Product</h1>
          <p>Fill in the details below to add a new item to your menu</p>
        </div>
        
        <form className="add-form" onSubmit={handleSubmit}>
         <div className='add-image-upload'>
            <label htmlFor="image" className={imagePreview ? 'has-image' : ''}>
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="image-preview" />
                ) : (
                  <>
                    <ImagePlus size={40} color="#ff5252" />
                    <p>Upload Product Image</p>
                    <span>Click to browse</span>
                  </>
                )}
                <input type="file" id="image" name="image" accept="image/*" onChange={handleImageChange} />
            </label>
         </div>

         <div className='form-row'>
           <div className='add-product-name'>
              <label>Product Name</label>
              <input 
                type="text" 
                name="name" 
                placeholder="e.g., Chicken Burger" 
                value={formData.name}
                onChange={handleInputChange}
                required 
              />
           </div>

           <div className='add-product-category'>
               <label>Product Category</label>
               <select 
                 name="category" 
                 id="product-category" 
                 value={formData.category}
                 onChange={handleInputChange}
                 required
               >
                  <option value="">Select a category</option>
                  <option value="DelightMeals">Delight Meals</option>
                  <option value="FastFood">Fast Food</option>
                  <option value="Snacks">Snacks</option>
                  <option value="GrubMart">GrubMart</option>
               </select>
           </div>
         </div>

         <div className='add-product-description'>
             <LimitedTextarea 
               label="Product Description" 
               maxWords={6}
               value={formData.description}
               onChange={handleDescriptionChange}
             />
         </div>

         <div className='add-product-price'>
             <label>Product Price</label>
             <div className="price-input-wrapper">
               <span className="currency-prefix">KSH</span>
               <input 
                 type="text" 
                 name="price" 
                 placeholder="0" 
                 value={formData.price}
                 onChange={handlePriceChange}
                 required 
               />
             </div>
             {formData.price && <p className="price-display">Price: KSH {formData.price}</p>}
         </div>

         <button type="submit" className='add-product-button' disabled={loading}>
           {loading ? (
             <>
               <Loader2 size={20} className="spinner" />
               <span>Adding Product...</span>
             </>
           ) : (
             <span>Add Product</span>
           )}
         </button>
        </form>
    </div>
  )
}

export default Add;