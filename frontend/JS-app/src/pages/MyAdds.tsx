import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

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
    return <div>Du måste vara inloggad för att se dina annonser.</div>;
  }
 
  return (
    <div>
      <h2>Mina Annonser</h2>
      {ads.length > 0 ? (
        <ul>
          {ads.map(ad => (
            <li key={ad._id}>
              <h3>{ad.Rubrik}</h3>
              <p>{ad.Beskrivning}</p>
              <p>Pris: {ad.Pris}</p>
              <p>Datum: {convertToLocalDate(ad.Date)}</p>
              <p>Stad: {ad.Stad}</p>
              {ad.Bild && (
                <img 
                  src={`http://localhost:5000/uploads/${ad.Bild}`} // Visa bilden från servern
                  
                  width="200" 
                />
              )}
              {/* Lägg till fler fält som behövs */}
            </li>
          ))}
        </ul>
      ) : (
        <p>Inga annonser funna för den här användaren.</p>
      )}
    </div>
  );
};

export default MyAds;