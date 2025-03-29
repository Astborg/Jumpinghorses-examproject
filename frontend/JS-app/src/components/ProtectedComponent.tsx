
import { useAuth0 } from '@auth0/auth0-react';

const ProtectedComponent = () => {
  const { getAccessTokenSilently } = useAuth0();

  const callProtectedAPI = async () => {
    const token = await getAccessTokenSilently();

    const response = await fetch('http://localhost:5001/api/protected', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.text();
    console.log(data);
  };

  return <button onClick={callProtectedAPI}>Anropa skyddad rutt</button>;
};

export default ProtectedComponent;