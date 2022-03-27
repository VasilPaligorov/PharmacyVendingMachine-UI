import React from 'react';
import ReactDOM from 'react-dom';
import './css/background.css';
import App from './App';
import LoggedInNavbar from './elements/SharedElements/navbar/loggedInNavbar';
import Navbar from './elements/SharedElements/navbar/navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.render(
  <React.StrictMode>
    <App />
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme='colored'
    />
  </React.StrictMode>,
  document.getElementById('root'),
);

ReactDOM.render(
  <React.StrictMode>
    {localStorage.getItem('email') ?
      <LoggedInNavbar /> 
      :<Navbar />
    }
  </React.StrictMode>,
  document.getElementById('navbar')
);