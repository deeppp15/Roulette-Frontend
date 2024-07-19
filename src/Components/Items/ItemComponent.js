import React, { useState } from 'react';
import { items, BASE_URL } from '../../Utils/Data';
import { HashLink as Link } from 'react-router-hash-link';

function ItemComponent({ selectedRetailer }) {
    const [itemList, setItemList] = useState([]);
    const [selectedItem, setSelectedItem] = useState('');
    const [itemPrice, setItemPrice] = useState('');
    const [error, setError] = useState(null);
    const [showItems, setShowItems] = useState(true);
    const [pointsResult, setPointsResult] = useState(null);

    const getPrice = (event) => {
        const item = event.target.value;
        setSelectedItem(item);
        const selectedData = items.find(x => x.shortDescription === item);
        setItemPrice(selectedData ? selectedData.price : '');
    };

    const addItem = () => {
        if (selectedItem && itemPrice) {
            setItemList([...itemList, { shortDescription: selectedItem, price: itemPrice }]);
            setSelectedItem('');
            setItemPrice('');
        }
    };

    const getCurrentDateTime = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
      
        const purchaseDate = `${year}-${month}-${day}`;
        const purchaseTime = `${hours}:${minutes}`;
      
        return { purchaseDate, purchaseTime };
      };
      
    const { purchaseDate, purchaseTime } = getCurrentDateTime();

    const handleBuy = async () => {
        if (!selectedRetailer || itemList.length === 0) {
            setError('Please select a retailer and add at least one item.');
            return;
        }

        const purchaseData = {
            retailer: selectedRetailer,
            purchaseDate: purchaseDate,
            purchaseTime: purchaseTime,
            items: itemList,
            total: itemList.reduce((acc, item) => acc + parseFloat(item.price), 0).toFixed(2)
        };

        try {
            const response = await fetch(`${BASE_URL}/process_receipt/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(purchaseData)
            });

            if (!response.ok) {
                throw new Error('Failed to process receipt');
            }

            const result = await response.json();
            const id = result.uid;

            const pointsResponse = await fetch(`${BASE_URL}/get_points/${id}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!pointsResponse.ok) {
                throw new Error('Failed to fetch points');
            }

            const pointsResult = await pointsResponse.json();
            setPointsResult(pointsResult.points); // Assuming pointsResult contains points attribute
            setError(null);

        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <section id="items">
            <div className="container">
                {showItems && (
                    <>
                        <label>
                            Select Item:
                            <select onChange={getPrice} value={selectedItem}>
                                <option value="">Select an item</option>
                                {items.map((item) => (
                                    <option key={item.shortDescription} value={item.shortDescription}>
                                        {item.shortDescription}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <input
                            type="text"
                            value={itemPrice}
                            readOnly
                            placeholder="Price will appear here"
                        />

                        <button type="button" onClick={addItem}>+</button>

                        {itemList.length > 0 && (
                            <>
                                <div>
                                    <h3>Selected Items</h3>
                                    <ul>
                                        {itemList.map((item, index) => (
                                            <li key={index}>{item.shortDescription} - ${item.price}</li>
                                        ))}
                                    </ul>
                                </div>

                                <button type="button" onClick={handleBuy}>Buy</button>
                            </>
                        )}
                    </>
                )}

                <div >
                    {pointsResult !== null && (
                        <div className="points">
                            <h3>Points Earned: {pointsResult}</h3>
                        </div>
                    )}
                </div>

                {error && (
                    <div className="error">
                        <h3>Error: {error}</h3>
                    </div>
                )}
            </div>
        </section>
    );
};

export default ItemComponent;
