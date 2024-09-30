import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const Home = () => {



  const handleLanguageChange = (e) => {
    const language = e.target.value;
    const googleTranslateElement = document.getElementById('google_translate_element');

    if (googleTranslateElement) {
      const selectElement = googleTranslateElement.querySelector('select');
      if (selectElement) {
        selectElement.value = language;
        selectElement.dispatchEvent(new Event('change'));
      }
    }
  }
    return (
        <>

<div className="home-container">
        <div className="welcome-section">
          <h2>Welcome to JumpingHorses.se</h2>
          <h3>Your Horse Ad site only for Jumpinghorses!</h3>
          <h4>Log in or sign up to see Ads</h4>
          <h4>Make a subscription to create new Ads</h4>
        </div>
      </div>

    

      </>
    );

}
  export default Home