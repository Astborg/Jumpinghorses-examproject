import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import HeadLayout from '../layout/HeadLayout';

interface Ad {
  _id: number;
  Rubrik: string;
  Beskrivning: string;
  Pris: number;
  AntalVisitors: number;
}

const Ad = () => {
  const { id } = useParams<{ id: string }>();  
  const [ad, setAd] = useState<Ad | null>(null);

  useEffect(() => {

    axios.get(`http://localhost:5000/ads/${id}`)
      .then(response => {
        setAd(response.data);
      })
      .catch(error => {
        console.error('Error fetching ad details:', error);
      });
  }, [id]);

  if (!ad) {
    return <div>Loading...</div>;  
  }

  return (
    <>
   
    <div>
      <h1>{ad.Rubrik}</h1>
      <p>{ad.Beskrivning}</p>
      <p>Price: {ad.Pris}</p>
      <p>Visitors: {ad.AntalVisitors}</p> 
    </div>
    </>
  );
};

export default Ad;