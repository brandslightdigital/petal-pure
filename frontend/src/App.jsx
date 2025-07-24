import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Topbar from './components/Topbar'
import './font.css';

import Footer from './components/Footer'
import { Navbar } from './components/Navbar'
import Shop from './components/Shop'
import ProductDetailPage from './components/ProductDetailPage'
import CheckoutPage from './components/CheckoutPage'
import ContactPage from './pages/ContactPage'
import SuccessPage from './components/SuccessPage'
import ScrollToTop from './components/ScrolltoTop'
import CartPage from './pages/CartPage'
import PrivacyPolicy from './pages/PrivacyPolicy'
import RefundPolicy from './pages/RefundPolicy'
import CancellationPolicy from './pages/CancellationPolicy'
import ShippingPolicy from './pages/ShippingPolicy'
import Disclaimer from './pages/Disclaimer'
import TermsAndConditions from './pages/Terms&condition'
import NewsBlogDetail from "./pages/NewsBlogDetail";


export const App = () => {
  return (
    <>
      <BrowserRouter>
        {/* <Topbar/>   */}
        <ScrollToTop />
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/shop' element={<Shop />} />
          <Route path="/product/:slug" element={<ProductDetailPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/success" element={<SuccessPage />} />
             <Route path="/news-blog/:slug" element={<NewsBlogDetail />} />
          <Route path="/cart" element={<CartPage/>} />

          {/* Term & condition , Privcy Policy, Refund Policy */}
          <Route path="/privacy-policy" element={<PrivacyPolicy/>} />"
          <Route path="refund-policy" element={<RefundPolicy/>} />
          <Route path="/cancellation-policy" element={<CancellationPolicy/>} />
          <Route path="/shipping-policy" element={<ShippingPolicy />} />
          <Route path="/disclaimer" element={<Disclaimer/>}/>
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  )
}
