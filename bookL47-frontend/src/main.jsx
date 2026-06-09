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



const router = createBrowserRouter([
  {
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/about", element: <About />},
      { path: "/join", element: <Join />},
      { path: "/conduct", element: <Conduct />},
      { path: "/book", element: <Book />}
    ],
  }
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
