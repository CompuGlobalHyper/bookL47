import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router";
import { CartProvider } from './contexts/CartContext.jsx';
import './index.css'
import App from './App.jsx'
import ErrorPage from './routes/general/ErrorPage.jsx';
import Home from './routes/homeRoutes/Home.jsx';
import About from './routes/general/About.jsx';
import Join from './routes/general/Join.jsx';
import Conduct from './routes/general/Conduct.jsx';
import Book from './routes/bookRoutes/Book.jsx';
import Cart from './routes/bookRoutes/Cart.jsx';
import NotFound from './routes/general/NotFound.jsx';
import requireUser from './loaders/requireUser.js';



const router = createBrowserRouter([
  {
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/about", element: <About />},
      { path: "/join", element: <Join />},
      { path: "/code-of-conduct", element: <Conduct />},
      { path: "*", element: <NotFound />},
      { loader: requireUser,
        children: [
          { path: "/book", element: <Book />},
          { path: '/cart', element: <Cart />}
        ]
      }
    ],
  }
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CartProvider>
      <RouterProvider router={router}/>
    </CartProvider>
  </StrictMode>
)
