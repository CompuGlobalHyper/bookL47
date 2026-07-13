import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router";
import './index.css'
import App from './App.jsx'
import ErrorPage from './routes/general/ErrorPage.jsx';
import Home from './routes/homeRoutes/Home.jsx';
import About from './routes/general/About.jsx';
import Join from './routes/general/Join.jsx';
import RoomInfo from './routes/general/RoomInfo.jsx';
import Conduct from './routes/general/Conduct.jsx';
import Contact from './routes/general/Contact.jsx'
import Book from './routes/bookRoutes/Book.jsx';
import Bookings from './routes/bookRoutes/Bookings.jsx';
import Cart from './routes/bookRoutes/Cart.jsx';
import Checkout from './routes/bookRoutes/Checkout.jsx';
import NotFound from './routes/general/NotFound.jsx';
import requireUser from './loaders/requireUser.js';
import { UserProvider } from './contexts/UserContext.jsx';
import { CartProvider } from './contexts/CartContext.jsx';



const router = createBrowserRouter([
  {
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/about", element: <About />},
      { path: "/join-L47", element: <Join />},
      { path: "/code-of-conduct", element: <Conduct />},
      { path: "/contact-us", element: <Contact />},
      { path: "/rooms", element: <RoomInfo />},
      { path: "*", element: <NotFound />},
      { loader: requireUser,
        children: [
          { path: "/book", element: <Book />},
          { path: "/bookings", element: <Bookings />},
          { path: '/cart', element: <Cart />},
          { path: '/checkout', element: <Checkout/>}
        ]
      }
    ],
  }
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <CartProvider>
        <RouterProvider router={router}/>
      </CartProvider>
    </UserProvider>
  </StrictMode>
)
