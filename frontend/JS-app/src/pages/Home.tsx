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
            `http://localhost:5001/api/user-role?userEmail=${userEmail}`
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
{(!userExist && isReady) && (
      <SaveUser></SaveUser>
    )}
<div className="home-container">
  <div className="welcome-section">
    <h2>Välkommen till Jumpinghorses.se</h2>
    <h3>Din annonsplattform enbart för hopphästar och hoppponnyer</h3>
    <h4>Du kan se alla annonser</h4>
    <h4>För att skapa ny annons vänligen logga in och skapa ett abonnemang</h4>
    <h4>Under mina annonser kan du se dina egna nya och gamla annonser</h4>
    <h4>You can choose language at the botton of the page</h4>
  </div>
</div>

    

      </>
    );

}
  export default Home