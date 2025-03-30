import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import '../style/NewAd.css'

const NewAd = () => {
  const { user, isAuthenticated } = useAuth0();
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(''); // Här hämtar du användarens prenumerationsplan
  const [adCreated, setAdCreated] = useState(false); // Håller reda på om en annons har skapats
  const [extraLink, setExtraLink] = useState(''); // Håller reda på extra fält för länken
  const [adCount, setAdCount] = useState(0);  
  const [youtubeLink, setYoutubeLink] = useState('');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    Storlek: '',
    Rubrik: '',
    Date: '',
    Pris: '',
    Beskrivning: '',
    Gender: '',
    Age: '',
    Height: '',
    Far: '',
    Morfar: '',
    Level: '',
    Stad: '',
    Xray: '',
    AntalVisitors: 0, 
    Person_id: '',
  });

  useEffect(() => {
    if (user && isAuthenticated) {
      // Sätt Person_id till användarens e-post eller annan unik identifierare
      setFormData((prevData:any) => ({
        ...prevData,
        Person_id: user.email // Ändra till en lämplig identifierare för Person_id
      }));

      // Hämta användarens prenumerationsplan
      axios.get('http://localhost:5001/api/user-plan', { params: { email: user.email } })
        .then(response => setSelectedPlan(response.data.plan))
        .catch(error => console.error('Error fetching user plan:', error));

      // Hämta antal annonser skapade av användaren
      axios.get('http://localhost:5001/api/ad-count', { params: { personId: user.email } }) // Ändra till korrekt personId
        .then(response => setAdCount(response.data.adCount))
        .catch(error => console.error('Error fetching ad count:', error));
    }
  }, [user, isAuthenticated]);

  console.log(formData.Person_id)
  const handleInputChange = (e:any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e:any) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleExtraLinkChange = (e:any) => {
    setExtraLink(e.target.value);
  };
  const handleYoutubeLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setYoutubeLink(e.target.value); // Update YouTube link state
  };

  const getTodaysDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');  // Månad (2 siffror)
    const day = today.getDate().toString().padStart(2, '0');  // Dag (2 siffror)
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    if (selectedPlan === 'price_1Pzz6AEGk7e8lKhxEtq9m3Mc' && adCreated) {
      alert('Du kan endast skapa en annons med din nuvarande prenumerationsplan.');
      return;
    }

    const data = new FormData();
    data.append('Storlek', formData.Storlek);
    data.append('Rubrik', formData.Rubrik);
    data.append('Date', formData.Date);
    data.append('Pris', formData.Pris);
    data.append('Beskrivning', formData.Beskrivning);
    data.append('Gender', formData.Gender);
    data.append('Age', formData.Age);
    data.append('Height', formData.Height);
    data.append('Far', formData.Far);
    data.append('Morfar', formData.Morfar);
    data.append('Level', formData.Level);
    data.append('Stad', formData.Stad);
    data.append('Röntgen', formData.Xray);
    data.append('Person_id', formData.Person_id);
    data.append('AntalVisitors', formData.AntalVisitors.toString());

    if (selectedFile) {
      data.append('Bild', selectedFile);
    }
    if (selectedPlan === 'price_1Pzz8VEGk7e8lKhxXF0u6GAo') {
      data.append('extraLink', extraLink);
      data.append('youtubeLink', youtubeLink);  // Skicka med extra länken om planen är Gold
    }
    console.log("Röntgen som skickas:", formData.Xray);
    try {
      const response = await axios.post('http://localhost:5001/api/new-ad', data,{
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log('Annons sparad:', response.data);
      alert('Annons sparad!');
      
      setAdCreated(true); 
      setFormData({
        Storlek: '',
        Rubrik: '',
        Date: '',
        Pris: '',
        Beskrivning: '',
        Gender: '',
        Age: '',
        Height: '',
        Far: '',
        Morfar: '',
        Level: '',
        Stad: '',
        Xray: '',
        AntalVisitors: 0, 
        Person_id: ''
      });
      
      setSelectedFile(null);
      setExtraLink('');
      
      navigate('/ads'); 

    } catch (error) {
      console.error('Fel vid inskickning av annons:', error);
      alert('Kunde inte spara annonsen. Försök igen.');
    }
  };
  
  return (
    <>
   <div className="new-ad-container">
    <h2>Skapa en ny Annons</h2>
  <form onSubmit={handleSubmit}>
    <label>Storlek</label>
    <select name="Storlek" value={formData.Storlek} onChange={handleInputChange} required >
    <option value="A-ponny">A-ponny</option>
    <option value="B-ponny">B-ponny</option>
    <option value="C-ponny">C-ponny</option>
    <option value="D-ponny">D-ponny</option>
    <option value="Häst">Häst</option>
    </select>

    <label>Rubrik:</label>
    <input type="text" name="Rubrik" value={formData.Rubrik} onChange={handleInputChange} required />

      <label>Datum:</label>
          <input 
            type="date" 
            name="Date" 
            value={formData.Date} 
            onChange={handleInputChange} 
            required 
            min={getTodaysDate()} 
            max={getTodaysDate()} 
          />

    <label>Pris:</label>
    <input type="text" name="Pris" value={formData.Pris} onChange={handleInputChange} required />

    <label>Beskrivning:</label>
    <textarea name="Beskrivning" value={formData.Beskrivning} onChange={handleInputChange} required />

    <label>Kön:</label>
    <input type="text" name="Gender" value={formData.Gender} onChange={handleInputChange} required />

    <label>Ålder:</label>
    <input type="text" name="Age" value={formData.Age} onChange={handleInputChange} required />

    <label>Mankhöjd:</label>
    <input type="text" name="Height" value={formData.Height} onChange={handleInputChange} required />

    <label>Far:</label>
    <input type="text" name="Far" value={formData.Far} onChange={handleInputChange} required />

    <label>Morfar:</label>
    <input type="text" name="Morfar" value={formData.Morfar} onChange={handleInputChange} required />

    <label>Nivå:</label>
    <input type="text" name="Level" value={formData.Level} onChange={handleInputChange} required />

    <label>Stad:</label>
    <input type="text" name="Stad" value={formData.Stad} onChange={handleInputChange} required />

    <label>Röntgen:</label>
    <input type="date" name="Xray" value={formData.Xray} onChange={handleInputChange} required />

    <label>Ladda upp bild:</label>
    <input type="file" name="Bild" onChange={handleFileChange} required />

    {selectedPlan === 'price_1Pzz8VEGk7e8lKhxXF0u6GAo' && (
      <div>
        <label>Länk:</label>
        <input type="text" value={extraLink} onChange={handleExtraLinkChange} placeholder="Ange en länk" />
        <label>YouTube Länk:</label>
            <input type="text" value={youtubeLink} onChange={handleYoutubeLinkChange} placeholder="Ange YouTube link" />
          </div>
      
    )}

    <button type="submit" disabled={selectedPlan === 'price_1Pzz6AEGk7e8lKhxEtq9m3Mc' && adCount >= 1}>
      Skapa Annons
    </button>
  </form>
</div>
    </>
  );
};

export default NewAd;