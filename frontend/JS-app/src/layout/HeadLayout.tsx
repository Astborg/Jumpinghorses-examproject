import { Link } from "react-router-dom";
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState, useRef  } from "react";
import axios from "axios";

export default function HeadLayout() {


    const { loginWithRedirect, logout, isAuthenticated, isLoading, user } = useAuth0();
    const [userRole, setUserRole] = useState<string | null>(null); 
    

    useEffect(() => {
      const fetchRole = async () => {
        if (user && isAuthenticated) {
          try {
            const userEmail = user.email;
            console.log(userEmail);
  
            
            const response = await axios.get(
              `http://localhost:5000/user-role?userEmail=${userEmail}`
            );
  
            setUserRole(response.data.role); 
            console.log('Användarens roll är:', response.data.role);
          } catch (error) {
            console.error('Failed to fetch role:', error);
          }
        }
      };
  
      fetchRole();
    }, [user, isAuthenticated]);

    // const saveUserToDatabase = async (user:any) => {
    //   try {
    //     await axios.post("http://localhost:5000/save-user", {
    //       email: user.email,
          
          
          
    //     });
    //   } catch (error) {
    //     console.error("Error saving user to the database", error);
    //   }
    // };

    // useEffect(() => {
    //   if (isAuthenticated && user) {
    //     console.log("Saving user to the database");
    //     saveUserToDatabase(user);
       
    //   }
    // }, [isAuthenticated, user]);

    if (isLoading) {
        return <div>Loading...</div>; 
    }
  return (
    <>
    
    <header className="header">
        
        {isAuthenticated ? (
            <nav>
            <ul>

                <li><Link to='/'>Home</Link></li>
                <li><Link to='/ads'>Ads</Link></li>
                <li><Link to='/subscription'>Subscription</Link></li>
                {userRole === 'subscriber' && (
                <>
                  <li><Link to='/newad'>New Ad</Link></li>
                  <li><Link to='/myads'>My Ads</Link></li>
                </>
              )}
                </ul>
                
                
                <button onClick={() => logout({ returnTo: window.location.origin })}>
                Logga ut
                </button>
                </nav>
                ) : (
                 <button onClick={() => loginWithRedirect()}>Logga in</button>
                    )}
                    
      
    
                
                
            
        
    </header>
    </>
  )
}
