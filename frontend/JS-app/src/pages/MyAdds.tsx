import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import '../style/MyAds.css'


interface Ad {
  _id: number;
  Rubrik: string;
  Date: string;
  Pris: string;
  Beskrivning: string;
  Gender: string;
  Age: string;
  Level: string;
  Stad: string;
  AntalVisitors: number;
  Person_id: number;
  Bild: string;
  Link: string; 
  Role: string;
}

const MyAds = () => {
  const { user, isAuthenticated } = useAuth0(); // Hämta användarens e-post från Auth0
  const [ads, setAds] = useState<Ad[]>([]);

  useEffect(() => {
    const fetchUserAds = async () => {
      if (user && isAuthenticated) {
        try {
          const response = await axios.get('http://localhost:5000/my-ads', {
            params: { email: user.email } // Skicka användarens e-post till backend
          });
          setAds(response.data); // Sätt annonserna i state
        } catch (error) {
          console.error('Error fetching user ads:', error);
        }
      }
    };

    fetchUserAds();
  }, [user, isAuthenticated]);

  const convertToLocalDate = (dateString: string) => {
    console.log(dateString)
const date = new Date(dateString);
return date.toLocaleDateString('sv-SE');  // Adjust to local time in Sweden (sv-SE)
  }

  if (!isAuthenticated) {
    return <div className="myads-container">Du måste vara inloggad för att se dina annonser.</div>;
  }
 
  return (
    <div className="myads-container">
    <h2 className="myads-heading">Mina Annonser</h2>
    {ads.length > 0 ? (
      <div className="ads-list">
        {ads.map(ad => (
          <div key={ad._id} className="ad-item">
            <div className="ad-image-container">
              <img 
                src={`http://localhost:5000/uploads/${ad.Bild}`} 
                alt={ad.Rubrik}
                className="ad-image"
              />
            </div>
            <div className="ad-details">
              <h3 className="ad-title">{ad.Rubrik}</h3>
              <p className="ad-description">Status: {ad.Role}</p>
              <p className="ad-description">{ad.Beskrivning}</p>
              <p className="ad-price">Pris: {ad.Pris} SEK</p>
              <p className="ad-date">Datum: {convertToLocalDate(ad.Date)}</p>
              <p className="ad-city">Stad: {ad.Stad}</p>
              {ad.Link && (
                <p className="ad-link">FöretagsLänk: <a href={ad.Link} target="_blank" rel="noopener noreferrer">{ad.Link}</a></p>
              )}
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p className="no-ads">Inga annonser funna för den här användaren.</p>
    )}
  </div>
  );
};

export default MyAds;