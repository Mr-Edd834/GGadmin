import React, { useState } from 'react'
import './Add.css'
import { ImagePlus, Loader2, Clock, Minus } from 'lucide-react'
import LimitedTextarea from '../../Components/Limitwords'
import api, { foodAPI } from '../../utils/api'
import { toast } from 'react-toastify'

const Add = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    prepTime: '',
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [prepTimeMode, setPrepTimeMode] = useState('absolute'); // 'absolute' or 'range'
  const [prepTimeMin, setPrepTimeMin] = useState('');
  const [prepTimeMax, setPrepTimeMax] = useState('');
  const [prepTimeAbsolute, setPrepTimeAbsolute] = useState('');

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

  const handlePrepTimeChange = (type, value) => {
    const numValue = value.replace(/[^0-9]/g, '');
    
    if (type === 'absolute') {
      setPrepTimeAbsolute(numValue);
      const prepTime = numValue ? `${numValue} min` : '';
      setFormData({ ...formData, prepTime });
    } else if (type === 'min') {
      setPrepTimeMin(numValue);
      const prepTime = numValue && prepTimeMax ? `${numValue}-${prepTimeMax} min` : '';
      setFormData({ ...formData, prepTime });
    } else if (type === 'max') {
      setPrepTimeMax(numValue);
      const prepTime = prepTimeMin && numValue ? `${prepTimeMin}-${numValue} min` : '';
      setFormData({ ...formData, prepTime });
    }
  };

  const handlePrepTimeModeChange = (mode) => {
    setPrepTimeMode(mode);
    setPrepTimeMin('');
    setPrepTimeMax('');
    setPrepTimeAbsolute('');
    setFormData({ ...formData, prepTime: '' });
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
      data.append('prepTime', formData.prepTime);
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
          prepTime: '',
        });
        setImage(null);
        setImagePreview(null);
        setPrepTimeMin('');
        setPrepTimeMax('');
        setPrepTimeAbsolute('');
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

         <div className='add-product-preptime'>
             <label>
               <Clock size={16} style={{ display: 'inline', marginRight: '6px' }} />
               Preparation Time
             </label>
             
             <div className="preptime-mode-toggle">
               <button
                 type="button"
                 className={`mode-button ${prepTimeMode === 'absolute' ? 'active' : ''}`}
                 onClick={() => handlePrepTimeModeChange('absolute')}
               >
                 <Clock size={16} />
                 <span>Absolute</span>
               </button>
               <button
                 type="button"
                 className={`mode-button ${prepTimeMode === 'range' ? 'active' : ''}`}
                 onClick={() => handlePrepTimeModeChange('range')}
               >
                 <Minus size={16} />
                 <span>Range</span>
               </button>
             </div>

             {prepTimeMode === 'absolute' ? (
               <div className="preptime-input-group">
                 <input
                   type="text"
                   placeholder="e.g., 30"
                   value={prepTimeAbsolute}
                   onChange={(e) => handlePrepTimeChange('absolute', e.target.value)}
                   className="preptime-input"
                 />
                 <span className="preptime-unit">minutes</span>
               </div>
             ) : (
               <div className="preptime-range-group">
                 <input
                   type="text"
                   placeholder="Min"
                   value={prepTimeMin}
                   onChange={(e) => handlePrepTimeChange('min', e.target.value)}
                   className="preptime-input"
                 />
                 <Minus size={20} color="#999" />
                 <input
                   type="text"
                   placeholder="Max"
                   value={prepTimeMax}
                   onChange={(e) => handlePrepTimeChange('max', e.target.value)}
                   className="preptime-input"
                 />
                 <span className="preptime-unit">minutes</span>
               </div>
             )}

             {formData.prepTime && (
               <p className="preptime-display">
                 <Clock size={16} />
                 Prep Time: {formData.prepTime}
               </p>
             )}
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