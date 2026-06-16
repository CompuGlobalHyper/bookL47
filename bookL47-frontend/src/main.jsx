import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router";
import { CartProvider } from './contexts/CartContext.jsx';
import './index.css'
import App from './App.jsx'
import ErrorPage from './routes/ErrorPage.jsx';
import Home from './routes/homeRoutes/Home.jsx';
import About from './routes/About.jsx';
import Join from './routes/Join.jsx';
import Conduct from './routes/Conduct.jsx';
import Book from './routes/Book.jsx';
import Cart from './routes/Cart.jsx';
import NotFound from './routes/NotFound.jsx';



const router = createBrowserRouter([
  {
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/about", element: <About />},
      { path: "/join", element: <Join />},
      { path: "/code-of-conduct", element: <Conduct />},
      { path: "/book", element: <Book />},
      { path: '/cart', element: <Cart />},
      { path: "*", element: <NotFound />}

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
