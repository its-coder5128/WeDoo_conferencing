import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { RouterProvider,createBrowserRouter,createRoutesFromElements,Route } from 'react-router-dom'
import CreateRoom from './pages/CreateRoom';
import Room from './pages/Room';
import BaseLayout from './layouts/BaseLayout';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" >
        <Route path='' element={<BaseLayout/>}>
          <Route index element={<CreateRoom/>}/>
          <Route path='room/:RoomID' element={<Room/>}/>
        </Route>
      </Route>
    </Route>

  )
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />  
  </React.StrictMode>
);

reportWebVitals();
