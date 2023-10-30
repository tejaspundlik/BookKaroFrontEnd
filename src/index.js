import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { SearchContextProvider } from './context/SearchContext';
import { AuthContextProvider } from './context/AuthContext';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <SearchContextProvider>
        <PayPalScriptProvider options={{
          "client-id": "AUviz0J32U7rwFdr-JaqKW5nTaNQxzixE78MUA7VxJd3CnDq9ofS0GpBwBtUWqfMHHeKm7MfgeG6B46q",
          currency: "USD"
        }}>
          <App />
        </PayPalScriptProvider>
      </SearchContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);

reportWebVitals();
