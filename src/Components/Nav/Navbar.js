import React from 'react';
import './Navbar.css'; // Make sure to import the CSS file
import { NavHashLink } from 'react-router-hash-link';

function Navbar() {

  return (
    <div className="navbar">
       {/* <NavHashLink to="/#retailer" smooth>
        <button type="button">Back</button>
      </NavHashLink> */}
      <h1>Roulette Tech</h1>
    </div>
  );
}

export default Navbar;
