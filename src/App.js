import React from 'react';
import './App.css';
import Navbar from './Components/Navbar';
import Sidebar from './Components/Sidebar';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Add from './Pages/Add/Add';
import Home from './Pages/Home';
import List from './Pages/List/List';
import Orders from './Pages/Orders/Orders';
import CompletedOrders from './Pages/CompletedOrders/CompletedOrders';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <BrowserRouter>
      <div>   
        <Navbar />
        <hr/>
        <div className="app-content">
          <Sidebar />
          <Routes>
            <Route path="/add" element={<Add />} />
            <Route path="/list" element={<List />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/completed-orders" element={<CompletedOrders />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </BrowserRouter>
   );
}

export default App;
