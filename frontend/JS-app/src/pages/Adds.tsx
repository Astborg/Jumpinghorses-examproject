import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../style/Ads.css'
interface Ad {
    _id: number;  
    Rubrik: string;
    Beskrivning: string;
    Pris: number;
    Date: string;
    Level: string;
    Stad: string;
    Bild: string;
  }
export default function Adds() {
    const [ads, setAds] = useState<Ad[]>([]);
    const [filteredAds, setFilteredAds] = useState<Ad[]>([]);
  const [searchCriteria, setSearchCriteria] = useState({
    Rubrik: '',
    Date: '',
    Pris: '',
    Level: '',
    Stad: ''
  });

    useEffect(() => {
        // Fetch ads from the backend
        axios.get('https://jumpinghorses-examproject-1.onrender.com/api/ads')
          .then(response => {
            setAds(response.data); // Set ads in the state
          })
          .catch(error => {
            console.error('Error fetching ads:', error);
          });
      }, []);

      const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSearchCriteria({
          ...searchCriteria,
          [name]: value
        });
      };

      useEffect(() => {
        const hasSearchCriteria = Object.values(searchCriteria).some((value) => value !== '');
    
        if (!hasSearchCriteria) {
          setFilteredAds(ads); 
        } else {
          const filtered = ads.filter(ad => {
            return (
              (searchCriteria.Rubrik === '' || ad.Rubrik.toLowerCase().includes(searchCriteria.Rubrik.toLowerCase())) &&
              (searchCriteria.Date === '' || new Date(ad.Date).toLocaleDateString('sv-SE').split('T')[0] === searchCriteria.Date) &&  
              (searchCriteria.Pris === '' || ad.Pris.toString().includes(searchCriteria.Pris)) &&
              (searchCriteria.Level === '' || ad.Level.toLowerCase().includes(searchCriteria.Level.toLowerCase())) &&
              (searchCriteria.Stad === '' || ad.Stad.toLowerCase().includes(searchCriteria.Stad.toLowerCase()))
            );
          });
          setFilteredAds(filtered);
        }
      }, [searchCriteria, ads]);
    
      const convertToLocalDate = (dateString: string) => {
        console.log(dateString)
  const date = new Date(dateString);
  return date.toLocaleDateString('sv-SE');  // Adjust to local time in Sweden (sv-SE)
};
  return (
    <>
      
      <h1 className="ads-title">Ads</h1>

      {/* Search fields */}
      <div className="search-container">
        <input
          type="text"
          name="Rubrik"
          placeholder="Search by title (Rubrik)"
          value={searchCriteria.Rubrik}
          onChange={handleInputChange}
        />
        <input
          type="date"
          name="Date"
          placeholder="Search by date (Datum)"
          value={searchCriteria.Date}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="Pris"
          placeholder="Search by price (Pris)"
          value={searchCriteria.Pris}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="Level"
          placeholder="Search by level (Nivå)"
          value={searchCriteria.Level}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="Stad"
          placeholder="Search by city (Stad)"
          value={searchCriteria.Stad}
          onChange={handleInputChange}
        />
      </div>

          {/* Display filtered ads */}
          <div className="ads-list">
        {filteredAds.map(ad => (
          <div className="ad-card" key={ad._id}>
            
            <div className="ad-details">
              <h3>{ad.Rubrik}</h3>
              <p>{ad.Beskrivning}</p>
              <p><strong>Price:</strong> {ad.Pris} SEK</p>
              <p><strong>Date:</strong> {convertToLocalDate(ad.Date)}</p>
              <p><strong>Level:</strong> {ad.Level}</p>
              <p><strong>City:</strong> {ad.Stad}</p>
              {ad.Bild && (
              <img 
                src={`https://jumpinghorses-examproject-1.onrender.com/uploads/${ad.Bild}`}
                className="ad-image2"
                alt={ad.Rubrik}
              />
            )}
            <div>
              <Link to={`/ads/${ad._id}`} className="read-more-btn">Read More</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

