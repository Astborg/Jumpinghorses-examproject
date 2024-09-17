import { Link } from "react-router-dom";
import { useAuth0 } from '@auth0/auth0-react';
export default function HeadLayout() {

    const { loginWithRedirect, logout, isAuthenticated, isLoading, user } = useAuth0();
    if (isLoading) {
        return <div>Loading...</div>;  // Visa en laddningsskärm medan Auth0 bekräftar autentisering
    }
  return (
    <>
    
    <header>
        
        {isAuthenticated ? (
            <nav>
            <ul>

                <li><Link to='/'>Home</Link></li>
                <li><Link to='/ads'>Ads</Link></li>
                <li><Link to='/subscription'>Subscription</Link></li>
                <li><Link to='/newad'>New Ad</Link></li>
                <li><Link to='/myads'>My Ads</Link></li>
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
