import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router";
import './index.css'
import App from './App.jsx'
import ErrorPage from './routes/ErrorPage.jsx';
import Home from './routes/homeRoutes/Home.jsx';
import About from './routes/About.jsx';
import Join from './routes/Join.jsx';
import Conduct from './routes/Conduct.jsx';
import Book from './routes/Book.jsx';
import NotFound from './routes/NotFound.jsx';



const router = createBrowserRouter([
  {
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/about", element: <About />},
      { path: "/join", element: <Join />},
      { path: "/cod-of-conduct", element: <Conduct />},
      { path: "/book", element: <Book />},
      { path: "*", element: <NotFound />}

    ],
  }
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
