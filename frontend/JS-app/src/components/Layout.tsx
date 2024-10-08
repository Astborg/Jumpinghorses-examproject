

import { Outlet } from 'react-router-dom'; // Importera Outlet från react-router-dom
import HeadLayout from '../layout/HeadLayout';


const Layout = () => {
  return (
    <>
      <HeadLayout /> {/* Här är din meny/huvudlayout */}
      
      <main>
        <Outlet /> {/* Outlet för att visa barnkomponenter beroende på rutt */}
      </main>
    </>
  );
};

export default Layout;