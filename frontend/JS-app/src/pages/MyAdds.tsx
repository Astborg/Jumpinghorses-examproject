import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import '../style/MyAds.css'


interface Ad {
  _id: number;
  Storlek: string, 
  Rubrik: string;
  Date: string;
  Pris: string;
  Beskrivning: string;
  Gender: string;
  Age: string;
  Height: string, 
  Far: string,
  Morfar: string, 
  Level: string;
  Stad: string;
  Xray: string, 
  AntalVisitors: number;
  Person_id: number;
  Bild: string;
  Link: string;
  Role: string;
  YoutubeLink?: string; 
}

const MyAds = () => {
  const { user, isAuthenticated } = useAuth0(); // Hämta användarens e-post från Auth0
  const [ads, setAds] = useState<Ad[]>([]);
  const [editAd, setEditAd] = useState<Ad | null>(null);

  useEffect(() => {
    const fetchUserAds = async () => {
      if (user && isAuthenticated) {
        try {
          const response = await axios.get('http://localhost:5001/api/my-ads', {
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

  const handleEdit = async () => {
    if (!editAd) return;
    try {
      await axios.put(`http://localhost:5001/api/my-ads`, editAd);
      setAds(ads.map(ad => (ad._id === editAd._id ? editAd : ad)));
      setEditAd(null); // Stäng redigeringsformuläret efter uppdatering
    } catch (error) {
      console.error('Error updating ad:', error);
    }
  };

  const handleDelete = async (adId: number) => {
    const confirmDelete = window.confirm('Är du säker på att du vill ta bort den här annonsen?');
  
    if (!confirmDelete) {
      return; // Avbryt borttagningen om användaren inte bekräftar
    }
  
    try {
      await axios.post('http://localhost:5001/api/my-ads', { _id: adId }); // Skicka borttagningsförfrågan via POST med body
      setAds(ads.filter(ad => ad._id !== adId)); // Ta bort annonsen från UI
      alert('Annonsen har tagits bort.');
    } catch (error) {
      console.error('Error deleting ad:', error);
      alert('Något gick fel. Annonsen kunde inte tas bort.');
    }
  };

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
      <div className="ads-list2">
        {ads.map(ad => (
          <div key={ad._id} className="ad-item">
            <div className="ad-image-container">
              <img 
                src={`http://localhost:5001/uploads/${ad.Bild}`} 
                alt={ad.Rubrik}
                className="ad-image"
              />
            </div>
            <div className="ad-details">
            <p className="ad-description">Storlek: {ad.Storlek}</p>
              <h3 className="ad-title">{ad.Rubrik}</h3>
              <p className="ad-description">Status: {ad.Role}</p>
              <p className="ad-description">{ad.Beskrivning}</p>
              <p>Gender: {ad.Gender}</p>
              <p>Level: {ad.Level}</p>
              <p>Age: {ad.Age}</p>
              <p>Height: {ad.Height}</p>
              <p>Far: {ad.Far}</p>
              <p>Morfar: {ad.Morfar}</p>
              <p className="ad-price">Pris: {ad.Pris} SEK</p>
              <p className="ad-date">Datum: {convertToLocalDate(ad.Date)}</p>
              <p className="ad-city">Stad: {ad.Stad}</p>
              <p className="ad-xray">Senaste Röntgen: {ad.Xray}</p>

              {ad.Link && (
                <p className="ad-link">FöretagsLänk: <a href={ad.Link} target="_blank" rel="noopener noreferrer">{ad.Link}</a></p>
              )}
              {ad.YoutubeLink && (
                <p className="ad-YTlink">YoutubeLänk: <a href={ad.YoutubeLink} target="_blank" rel="noopener noreferrer">{ad.YoutubeLink}</a></p>
              )}
              <button onClick={() => setEditAd(ad)}>Redigera</button>
              <button onClick={() => handleDelete(ad._id)}>Ta bort</button> 
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p className="no-ads">Inga annonser funna för den här användaren.</p>
    )}
    {editAd && (
        <div className="edit-form">
          <h2>Redigera annons</h2>
          <select value={editAd.Storlek} onChange={e => setEditAd({ ...editAd, Storlek: e.target.value })} >
            <option value="A-ponny">A-ponny</option>
            <option value="B-ponny">B-ponny</option>
            <option value="C-ponny">C-ponny</option>
            <option value="D-ponny">D-ponny</option>
            <option value="Häst">Häst</option>
            </select>
          <input type="text" placeholder="Rubrik" value={editAd.Rubrik} onChange={e => setEditAd({ ...editAd, Rubrik: e.target.value })} />
          <input type="text" placeholder="Pris" value={editAd.Pris} onChange={e => setEditAd({ ...editAd, Pris: e.target.value })} />
          <textarea placeholder="Beskrivning" value={editAd.Beskrivning} onChange={e => setEditAd({ ...editAd, Beskrivning: e.target.value })} />
          <input type="text" placeholder="Ålder" value={editAd.Age} onChange={e => setEditAd({ ...editAd, Age: e.target.value })} />
          <input type="text" placeholder="Mankhöjd" value={editAd.Height} onChange={e => setEditAd({ ...editAd, Height: e.target.value })} />
          <input type="text" placeholder="Far" value={editAd.Far} onChange={e => setEditAd({ ...editAd, Far: e.target.value })} />
          <input type="text" placeholder="Morfar" value={editAd.Morfar} onChange={e => setEditAd({ ...editAd, Morfar: e.target.value })} />
          <input type="text" placeholder="Kön" value={editAd.Gender} onChange={e => setEditAd({ ...editAd, Gender: e.target.value })} />
          <input type="text" placeholder="Nivå" value={editAd.Level} onChange={e => setEditAd({ ...editAd, Level: e.target.value })} />
          <input type="text" placeholder="Stad" value={editAd.Stad} onChange={e => setEditAd({ ...editAd, Stad: e.target.value })} />
          <label htmlFor=""><small>Senaste röntgen:</small></label>
          <input type="date" placeholder="Röntgen" value={editAd.Xray} onChange={e => setEditAd({ ...editAd, Xray: e.target.value })} />
          <input type="text" placeholder="Företagslänk" value={editAd.Link} onChange={e => setEditAd({ ...editAd, Link: e.target.value })} />
          <input type="text" placeholder="Youtubelänk" value={editAd.YoutubeLink} onChange={e => setEditAd({ ...editAd, YoutubeLink: e.target.value })} />
          <button onClick={handleEdit}>Spara ändringar</button>
          <button onClick={() => setEditAd(null)}>Avbryt</button>
        </div>
      )}
      
  </div>
  );
};

export default MyAds;