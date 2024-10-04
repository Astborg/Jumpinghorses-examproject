import React, { useEffect, useState } from 'react'
import HeadLayout from '../layout/HeadLayout'
import SaveUser from '../components/SaveUser'
import { useAuth0 } from '@auth0/auth0-react';
import axios from "axios";

export default function Login() {
  const {isAuthenticated, user} = useAuth0();
  const [userExist, setUserExist] = useState<string | null>(null);
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    const fetchRole = async () => {
      if (user && isAuthenticated) {
        try {
          const userEmail = user.email;
          console.log(userEmail);

          
          const response = await axios.get(
            `http://localhost:5000/user-role?userEmail=${userEmail}`
          );

          
          setUserExist(response.data.email)
          setIsReady(true)
          console.log('användaren är:',response.data.email)
        } catch (error) {
          console.error('Failed to fetch role:', error);
          setIsReady(true)
        }
      }
    };

    fetchRole();
  }, [user, isAuthenticated]);

  return (
    <>
    
    
    <div>Login</div>
    </>
    
  )
}
