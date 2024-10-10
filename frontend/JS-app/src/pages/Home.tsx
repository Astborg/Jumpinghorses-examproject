import  { useState, useEffect } from 'react';
import axios from 'axios';

import { useAuth0 } from '@auth0/auth0-react';


import '../style/Home.css'
import SaveUser from '../components/SaveUser';
const Home = () => {

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
            `http://localhost:5000/api/user-role?userEmail=${userEmail}`
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


  const handleLanguageChange = (e:any) => {
    const language = e.target.value;
    const googleTranslateElement = document.getElementById('google_translate_element');

    if (googleTranslateElement) {
      const selectElement = googleTranslateElement.querySelector('select');
      if (selectElement) {
        selectElement.value = language;
        selectElement.dispatchEvent(new Event('change'));
      }
    }
  }
    return (
        <>
{(!userExist && isReady) && (
      <SaveUser></SaveUser>
    )}
<div className="home-container">
  <div className="welcome-section">
    <h2>Welcome to JumpingHorses.se</h2>
    <h3>Your Horse Ad site only for Jumpinghorses!</h3>
    <h4>Click on the Log in button to Login or sign up to see all Ads</h4>
    <h4>After that you can make a subscription to create new Ads</h4>
    <h4>Go under MyAds to see all of your own Ads</h4>
    <h4>Under every Ad your can press Read More to see full information</h4>
    <h4>You can choose which language you want to translate the website at the bottom of the page</h4>
  </div>
</div>

    

      </>
    );

}
  export default Home