import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface Ad {
  _id: number;
  Rubrik: string;
  Beskrivning: string;
  Pris: number;
}

const Ad = () => {
  const { id } = useParams<{ id: string }>();  // Get the ad ID from the URL
  const [ad, setAd] = useState<Ad | null>(null);

  useEffect(() => {
    // Fetch the ad details from the backend using the ad ID
    axios.get(`http://localhost:5000/ads/${id}`)
      .then(response => {
        setAd(response.data);
      })
      .catch(error => {
        console.error('Error fetching ad details:', error);
      });
  }, [id]);

  if (!ad) {
    return <div>Loading...</div>;  // Show loading state while fetching data
  }

  return (
    <div>
      <h1>{ad.Rubrik}</h1>
      <p>{ad.Beskrivning}</p>
      <p>Price: {ad.Pris}</p>
    </div>
  );
};

export default Ad;