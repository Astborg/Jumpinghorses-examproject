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
        <nav>
            <ul>
                <li><Link to='/'>Home</Link></li>
                <li><Link to='/ads'>Adds</Link></li>
                <li><Link to='/subscription'>Subsription</Link></li>
                <li><Link to='/newad'>New Add</Link></li>
                <li><Link to='/myads'>My Adds</Link></li>
                <div>
                {isAuthenticated ? (
                <button onClick={() => logout({ returnTo: window.location.origin })}>
                Logga ut
                </button>
                ) : (
                 <button onClick={() => loginWithRedirect()}>Logga in</button>
                    )}
                    </div>
      
    
                
                
            </ul>
        </nav>
    </header>
    </>
  )
}
