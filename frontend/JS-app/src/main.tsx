
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './index.css'
import Home from "./pages/Home";
import Adds from "./pages/Adds";
import Login from "./pages/Login";
import MyAdds from "./pages/MyAdds";
import NewAdd from "./pages/NewAdd";
import Subscriptions from "./pages/Subcriptions";
import { Auth0Provider } from '@auth0/auth0-react';
import Ad from "./pages/Ad";
import Success from "./pages/Success";
import Layout from "./components/Layout";




const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout/>, // Använd Layout som parent
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/ads",
        element: <Adds />
      },
      {
        path: "/ads/:id",
        element: <Ad />
      },
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/myads",
        element: <MyAdds />
      },
      {
        path: "/newad",
        element: <NewAdd />
      },
      {
        path: "/subscription",
        element: <Subscriptions />
      },
      {
        path: "/success",
        element: <Success />
      }
    ]
  }
]);


ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <>
  
       <Auth0Provider
        domain="dev-750v23phcwvolq52.us.auth0.com"
        clientId="1KJEmXaQwWpBo9yl6r0pNY379JsVDsc3"
        authorizationParams={{
           audience: 'https://dev-750v23phcwvolq52.us.auth0.com/api/v2/',
          redirect_uri: "https://jumpinghorses-examproject-alva-numtip99a-astborgs-projects.vercel.app/"
        }}
        cacheLocation="localstorage" 
  >
      <RouterProvider router={router} />
     
      </Auth0Provider>
      </>
  // </React.StrictMode>
);

