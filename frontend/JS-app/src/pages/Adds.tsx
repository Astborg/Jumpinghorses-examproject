import React from 'react'
import HeadLayout from '../layout/HeadLayout'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Ad {
    _id: number;  
    Rubrik: string;
    Beskrivning: string;
    Pris: number;
    Date: string;
    Nivå: string;
    Stad: string;
  }
export default function Adds() {
    const [ads, setAds] = useState<Ad[]>([]);
    const [filteredAds, setFilteredAds] = useState<Ad[]>([]);
  const [searchCriteria, setSearchCriteria] = useState({
    Rubrik: '',
    Date: '',
    Pris: '',
    Nivå: '',
    Stad: ''
  });

    useEffect(() => {
        // Fetch ads from the backend
        axios.get('http://localhost:5000/ads')
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
              (searchCriteria.Nivå === '' || ad.Nivå.toLowerCase().includes(searchCriteria.Nivå.toLowerCase())) &&
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
      
      <h1>Ads</h1>

      {/* Search fields */}
      <div>
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
          name="Nivå"
          placeholder="Search by level (Nivå)"
          value={searchCriteria.Nivå}
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
      <ul>
        {filteredAds.map(ad => (
          <li key={ad._id}>
            <h3>{ad.Rubrik}</h3>
            <p>{ad.Beskrivning}</p>
            <p>Price: {ad.Pris}</p>
            <p>Date: {convertToLocalDate(ad.Date)}</p>
            <p>Level: {ad.Nivå}</p>
            <p>City: {ad.Stad}</p>
            <Link to={`/ads/${ad._id}`}>Read More</Link>
          </li>
        ))}
      </ul>
    </>
  );
}

