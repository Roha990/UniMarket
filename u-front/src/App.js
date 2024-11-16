import React from 'react';
import {RouterProvider} from 'react-router-dom';
import router from './navigation.js';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  return (
      <div>
        <RouterProvider router={router}>
        </RouterProvider>
      </div>
  );
};

export default App;
