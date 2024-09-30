import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import '../style/Ad.css'

interface Ad {
  _id: number;
  Rubrik: string;
  Beskrivning: string;
  Pris: number;
  AntalVisitors: number;
  Stad: string;
  Bild: string;  
}

const Ad = () => {
  const { id } = useParams<{ id: string }>();  
  const [ad, setAd] = useState<Ad | null>(null);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);

  const googleMapsApiKey = 'AIzaSyA14uTE0zxVHKhqKZsKqeraWpKpg8sl_wI'; // Replace with your Google Maps API key
  useEffect(() => {

    axios.get(`http://localhost:5000/ads/${id}`)
      .then(response => {
        setAd(response.data);
        geocodeCity(response.data.Stad); 
      })
      .catch(error => {
        console.error('Error fetching ad details:', error);
      });
  }, [id]);

  const geocodeCity = async (city: string) => {
    try {
      const response = await axios.get(`http://localhost:5000/geocode?city=${encodeURIComponent(city)}`);
      if (response.data.results.length > 0) {
        const location = response.data.results[0].geometry.location;
        setCoordinates({ lat: location.lat, lng: location.lng });
      } else {
        console.log('No results found for city:', city);
      }
    } catch (error) {
      console.error('Error fetching geocode:', error);
    }
  };

  if (!ad) {
    return <div>Loading...</div>;  
  }

  return (
    <>
   
    
    <div className="ad-container">
      <div className="ad-details">
        <h1 className="ad-title">{ad.Rubrik}</h1>
        <p className="ad-description">{ad.Beskrivning}</p>
        <p className="ad-price"><strong>Price:</strong> {ad.Pris} SEK</p>
        <p className="ad-visitors"><strong>Visitors:</strong> {ad.AntalVisitors}</p>
        {ad.Bild && (
              <img 
                src={`http://localhost:5000/uploads/${ad.Bild}`}
                className="ad-image"
                
                alt={ad.Rubrik}
              />
            )}
        <p className="ad-city"><strong>City:</strong> {ad.Stad}</p>
      </div>
      {coordinates && (
        <LoadScript googleMapsApiKey='AIzaSyA14uTE0zxVHKhqKZsKqeraWpKpg8sl_wI'>
          <GoogleMap
            mapContainerStyle={{ height: '400px', width: '100%' }}
            zoom={12}
            center={coordinates}
          >
            <Marker position={coordinates} />
          </GoogleMap>
        </LoadScript>
      )}
    </div>
    </>
  );
};

export default Ad;