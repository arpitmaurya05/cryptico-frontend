import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Navbar from './Components/navbar'
import AboutUs from './Components/AboutUs'
import Home from './Components/home'
import Footer from './Components/footer'
import Transaction from './Components/transaction'
import Login from './Components/Login'
import Signup from './Components/Signup'
import { Analytics } from "@vercel/analytics/react"

function App() {
  return (
    <div className='app'>
      <Navbar />
      <Routes>
        <Route path="/" element={
          <>
            <div className='screen-size'>
              <Home />
            </div>
            <Transaction />
          </>
        } />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
      <Footer />
            <Analytics />
    </div>
  )
}

export default App