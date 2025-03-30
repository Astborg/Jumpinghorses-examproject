import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../style/Ads.css';

interface Ad {
  _id: number;
  Storlek: string;
  Rubrik: string;
  Beskrivning: string;
  Pris: number;
  Date: string;
  Age: string;
  Height: string;
  Far: string;
  Morfar: string;
  Level: string;
  Stad: string;
  Bild: string;
  Röntgen: string;
}

export default function Adds() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [filteredAds, setFilteredAds] = useState<Ad[]>([]);
  const [searchCriteria, setSearchCriteria] = useState({
    Rubrik: '',
    Storlek: '',
    Date: '',
    Pris: '',
    Age: '',
    Height: '',
    Far: '',
    Morfar: '',
    Level: '',
    Stad: '',
    Röntgen: '',
  });

  useEffect(() => {
    axios.get('http://localhost:5001/api/ads')
      .then(response => {
        setAds(response.data);
      })
      .catch(error => {
        console.error('Error fetching ads:', error);
      });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSearchCriteria({
      ...searchCriteria,
      [name]: value
    });
  };

  useEffect(() => {
    const hasSearchCriteria = Object.values(searchCriteria).some(value => value !== '');

    if (!hasSearchCriteria) {
      setFilteredAds(ads);
    } else {
      const filtered = ads.filter(ad => {
        return (
          (searchCriteria.Rubrik === '' || ad.Rubrik.toLowerCase().includes(searchCriteria.Rubrik.toLowerCase())) &&
          (searchCriteria.Storlek === '' || ad.Storlek.toLowerCase().includes(searchCriteria.Storlek.toLowerCase())) &&
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
    const date = new Date(dateString);
    return date.toLocaleDateString('sv-SE');  
  };

  return (
    <>
      <h1 className="ads-title">Annonser</h1>

      {/* Search fields */}
      <div className="search-container">
        <input type="text" name="Rubrik" placeholder="Sök på rubrik" value={searchCriteria.Rubrik} onChange={handleInputChange} />
        <select name="Storlek" value={searchCriteria.Storlek} onChange={handleInputChange}>
          <option value="">Välj storlek</option>
          <option value="A-ponny">A-ponny</option>
          <option value="B-ponny">B-ponny</option>
          <option value="C-ponny">C-ponny</option>
          <option value="D-ponny">D-ponny</option>
          <option value="Häst">Häst</option>
        </select>
        <input type="date" name="Date" value={searchCriteria.Date} onChange={handleInputChange} />
        <input type="text" name="Pris" placeholder="Sök på pris" value={searchCriteria.Pris} onChange={handleInputChange} />
        <input type="text" name="Level" placeholder="Sök på nivå" value={searchCriteria.Level} onChange={handleInputChange} />
        <input type="text" name="Stad" placeholder="Sök på stad" value={searchCriteria.Stad} onChange={handleInputChange} />
      </div>

      {/* Display filtered ads */}
      <div className="ads-list">
        {filteredAds.map(ad => (
          <div className="ad-card" key={ad._id}>
            {ad.Bild && <img src={`http://localhost:5001/uploads/${ad.Bild}`} className="ad-image2" alt={ad.Rubrik} />}
            <div className="ad-details">
              <h3>{ad.Rubrik}</h3>
              <p><strong>Storlek:</strong> {ad.Storlek}</p>
              <p><strong>Ålder:</strong> {ad.Age} år</p>
              <p><strong>Mankhöjd:</strong> {ad.Height} cm</p>
              <p><strong>Far:</strong> {ad.Far}</p>
              <p><strong>Morfar:</strong> {ad.Morfar}</p>
              <p>{ad.Beskrivning.length > 100 ? ad.Beskrivning.slice(0, 100) + "..." : ad.Beskrivning}</p>
              <p><strong>Pris:</strong> {ad.Pris} SEK</p>
              <p><strong>Inlagt datum:</strong> {convertToLocalDate(ad.Date)}</p>
              <Link to={`/ads/${ad._id}`} className="read-more-btn">Läs mer</Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}