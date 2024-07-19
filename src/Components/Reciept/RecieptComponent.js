import React, { useState, useEffect } from 'react';
import { retailers } from '../../Utils/Data';
import './RecieptComponent.css';
import ItemComponent from '../Items/ItemComponent';

function Receipt() {
  const [selectedRetailer, setSelectedRetailer] = useState('');

  const getRetailer = (event) => {
    const retailer = event.target.value;
    setSelectedRetailer(retailer);
  };

  useEffect(() => {
    if (selectedRetailer) {
      document.getElementById('items').scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedRetailer]);

  return (
    <section id="retailer">
    <div className="container">
      <form >
        <label>Select Retailer:  
          <select onChange={getRetailer} value={selectedRetailer}>
            <option value="">Select a retailer</option>
            {retailers.map((retailer) => (
              <option key={retailer} value={retailer}>{retailer}</option>
            ))}
          </select>
        </label>
      </form>
      <div id="item-section" >
        <ItemComponent selectedRetailer={selectedRetailer} />
      </div>     
    </div>
    </section>
  );
}

export default Receipt;