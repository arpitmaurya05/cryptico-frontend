import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Navbar from './Components/navbar'
import AboutUs from './Components/AboutUs'
import Home from './Components/home'
import Footer from './Components/footer'
import Login from './Components/Login'
import Signup from './Components/Signup'
import { Analytics } from "@vercel/analytics/react"
 import NewsFeed from './Components/NewsFeed'
import CryptoChart from './Components/CryptoChart'
import ProfilePage from './Components/Profilepage'
import WalletDashboard from './Components/WalletDashboard'
import Transaction from './Components/Transactionpage'

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
         
          </>
        } />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/news" element={<NewsFeed />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/chart" element={<CryptoChart />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/wallet" element={<WalletDashboard />} />
        <Route path="/Transactionpage" element={<Transaction/>} />

      </Routes>
      <Footer />
            <Analytics />
    </div>
  )
}

export default App