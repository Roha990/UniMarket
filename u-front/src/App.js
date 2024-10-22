import React from 'react';
import {RouterProvider} from 'react-router-dom';
import router from './navigation.js';

const App = () => {
  return (
      <div style={{height: '100%'}}>
        <RouterProvider router={router}>
        </RouterProvider>
      </div>
  );
};

export default App;
