import "./App.css";
import Navbaar from "./components/header/Navbaar";
import Newnav from "./components/newnavbaar/Newnav";
import Maincomp from "./components/Home/Maincomp";
import Footer from "./components/Footer/Footer";
import Sign_in from "./components/signup_sign/Sign_in";
import Sign_Up from "./components/signup_sign/Sign_Up";
import Cart from "./components/cart/Cart";
import Buynow from "./components/buynow/Buynow";
import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import CircularProgress from "@mui/material/CircularProgress";

function App() {
  const [data, setdata] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setdata(true);
    }, 2000);
  });

  return (
    <>
      {data ? (
        <>
          <Navbaar />
          <Newnav />
          <Routes>
            <Route path="/" element={<Maincomp />} />
            <Route path="/login" element={<Sign_in />} />
            <Route path="/register" element={<Sign_Up />} />
            <Route path="/getproductsone/:id" element={<Cart />} />
            <Route path="/buynow" element={<Buynow />} />
          </Routes>
          <Footer />
        </>
      ) : (
        <div className="circle">
          <CircularProgress />
          <h2>Loading...</h2>
        </div>
      )}
    </>
  );
}

export default App;
