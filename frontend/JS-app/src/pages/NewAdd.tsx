import React, { useState } from 'react';
import axios from 'axios';
import HeadLayout from '../layout/HeadLayout';

const NewAd = () => {
  const [formData, setFormData] = useState({
    Rubrik: '',
    Date: '',
    Pris: '',
    Beskrivning: '',
    Gender: '',
    Age: '',
    Level: '',
    Stad: '',
    AntalVisitors: 0, // Initiala besökare är noll
    Person_id: 1 // Ändra detta till att komma från användarens session eller annan logik
  });
  const [selectedFile, setSelectedFile] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('Rubrik', formData.Rubrik);
    data.append('Date', formData.Date);
    data.append('Pris', formData.Pris);
    data.append('Beskrivning', formData.Beskrivning);
    data.append('Gender', formData.Gender);
    data.append('Age', formData.Age);
    data.append('Level', formData.Level);
    data.append('Stad', formData.Stad);
    data.append('AntalVisitors', formData.AntalVisitors);
    data.append('Person_id', formData.Person_id);
    if (selectedFile) {
      data.append('Bild', selectedFile);
    }

    try {
      const response = await axios.post('http://localhost:5000/new-ad', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Annons sparad:', response.data);
      alert('Annons sparad!');
    } catch (error) {
      console.error('Fel vid inskickning av annons:', error);
      alert('Kunde inte spara annonsen. Försök igen.');
    }
  };

  return (
    <>
  
    <form onSubmit={handleSubmit}>
      <label>Rubrik:</label>
      <input type="text" name="Rubrik" value={formData.Rubrik} onChange={handleInputChange} required />

      <label>Datum:</label>
      <input type="date" name="Date" value={formData.Date} onChange={handleInputChange} required />

      <label>Pris:</label>
      <input type="text" name="Pris" value={formData.Pris} onChange={handleInputChange} required />

      <label>Beskrivning:</label>
      <textarea name="Beskrivning" value={formData.Beskrivning} onChange={handleInputChange} required />

      <label>Kön:</label>
      <input type="text" name="Gender" value={formData.Gender} onChange={handleInputChange} required />

      <label>Ålder:</label>
      <input type="text" name="Age" value={formData.Age} onChange={handleInputChange} required />

      <label>Nivå:</label>
      <input type="text" name="Level" value={formData.Level} onChange={handleInputChange} required />

      <label>Stad:</label>
      <input type="text" name="Stad" value={formData.Stad} onChange={handleInputChange} required />

      <label>Ladda upp bild:</label>
      <input type="file" name="Bild" onChange={handleFileChange} required />

      <button type="submit">Skapa Annons</button>
    </form>
    </>
  );
};

export default NewAd;
