import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import '../style/Ad.css'

interface Ad {
  _id: number;
  Rubrik: string;
  Storlek: string,
  Beskrivning: string;
  Pris: number;
  AntalVisitors: number;
  Stad: string;
  Bild: string; 
  Person_id: string;
  Gender: string;
  Age: string;
  Height: string;
  Far: string,
  Morfar: string, 
  Date: string;  
  Level: string;
  Link: string;
  YoutubeLink?: string; 
  Röntgen: string;
}

const Ad = () => {
  const { id } = useParams<{ id: string }>();  
  const [ad, setAd] = useState<Ad | null>(null);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);

  ; // Replace with your Google Maps API key
  useEffect(() => {

    axios.get(`http://localhost:5001/api/ads/${id}`)
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
      const response = await axios.get(`http://localhost:5001/api/geocode?city=${encodeURIComponent(city)}`);
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
  const convertToLocalDate = (dateString: string) => {
    console.log(dateString)
const date = new Date(dateString);
return date.toLocaleDateString('sv-SE');  // Adjust to local time in Sweden (sv-SE)
};
const extractYouTubeID = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

if (!ad) {
  return <div>Loading...</div>;
}

const youtubeID = ad.YoutubeLink ? extractYouTubeID(ad.YoutubeLink) : null;

  
  return (
    <>
   
    
    <div className="ad-container">
      <div className="ad-details2">
      <p><strong>Datum:</strong> {convertToLocalDate(ad.Date)}</p>
        <h1 className="ad-title">{ad.Rubrik}</h1>
        <div className="ad-flex-box">
        <div className="ad-image-container">
        {ad.Bild && (
              <img 
                src={`http://localhost:5001/uploads/${ad.Bild}`}
                className="ad-image"
                
                alt={ad.Rubrik}
              />
            )}
          </div>
          <div className="ad-details3">
        <p><strong>Storlek:</strong> {ad.Storlek}</p>
        <p><strong>Kön:</strong> {ad.Gender}</p>
        <p><strong>Nivå:</strong> {ad.Level}</p>
        <p><strong>Ålder:</strong> {ad.Age} år</p>
        <p><strong>Mankhöjd:</strong> {ad.Height} cm</p>
        <p><strong>Far:</strong> {ad.Far}</p>
        <p><strong>Morfar:</strong> {ad.Morfar}</p>
        <p><strong>Senaste röntgen:</strong> {ad.Röntgen}</p>
        <p><strong>Price:</strong> {ad.Pris} SEK</p>
        <p><strong>Visitors:</strong> {ad.AntalVisitors}</p>
        </div>
        </div>
        <p><strong>Contact:</strong> {ad.Person_id}</p>
        {ad.Link && (
                <p className="ad-link"><strong>Companylink:</strong> <a href={ad.Link} target="_blank" rel="noopener noreferrer">{ad.Link}</a></p>
              )}
        
             {youtubeID && (
          <div className="ad-image-container">
            <iframe
              width="560"
              height="315"
              src={`https://www.youtube.com/embed/${youtubeID}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="YouTube Video"
            ></iframe>
          </div>
        )}
        <p className="ad-description">{ad.Beskrivning}</p>
        <p className="ad-city"><strong>City:</strong> {ad.Stad}</p>
      </div>
      {coordinates && (
        <LoadScript googleMapsApiKey='AIzaSyDbemniGBYZxAwRvuCbMkcmzh56zH2fgF4'>
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