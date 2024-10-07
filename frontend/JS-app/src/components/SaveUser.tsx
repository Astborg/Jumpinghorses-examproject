import React, { useEffect } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

const SaveUser = () => {
  const { user, isAuthenticated } = useAuth0();

  useEffect(() => {
    const saveUserToDatabase = async () => {
      if (isAuthenticated && user) {
        try {
          await axios.post("http://localhost:5000/api/save-user", {
            email: user.email,
            // eventuellt fler fält från user
          });
          console.log("User saved to database:", user.email);
        } catch (error) {
          console.error("Error saving user to the database", error);
        }
      }
    };

    saveUserToDatabase();
  }, [isAuthenticated, user]);

  return null; // Returnerar ingen visuell komponent, bara logik
};

export default SaveUser;