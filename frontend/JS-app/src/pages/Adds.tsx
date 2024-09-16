import React from 'react'
import HeadLayout from '../layout/HeadLayout'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Ad {
    _id: number;  // If you use 'id' from MySQL, not '_id' (MongoDB style)
    Rubrik: string;
    Beskrivning: string;
    Pris: number;
  }
export default function Adds() {
    const [ads, setAds] = useState<Ad[]>([]);

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
  return (
    <>
    <HeadLayout></HeadLayout>
    <div>Adds</div>
    <h1>Ads</h1>
      <ul>
        {ads.map(ad => (
          <li key={ad._id}>
            <h3>{ad.Rubrik}</h3>
            <p>{ad.Beskrivning}</p>
            <p>Price: {ad.Pris}</p>
            <Link to={`/ads/${ad._id}`}>Read More</Link>
          </li>
        ))}
      </ul>
     </>
  )
}
