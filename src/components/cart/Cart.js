import React, { useContext, useEffect, useState } from "react";
import "./cart.css";
import { Divider } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { LoginContext } from "../context/ContextProvider";
import CircularProgress from "@mui/material/CircularProgress";

const Cart = () => {
  const { id } = useParams("");

  const history = useNavigate("");

  const { account, setAccount } = useContext(LoginContext);

  const [inddata, setInddata] = useState("");
  console.log("inddata", inddata);

  const getinddata = async () => {
    const res = await fetch(`http://localhost:8005/getproductsone/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (res.status !== 201) {
      console.log("no data available");
    } else {
      console.log("getdata");
      setInddata(data);
    }
  };

  useEffect(() => {
    setTimeout(getinddata, 1000);
  }, [id]);

  //add cart data

  const addtocart = async (id) => {
    const checkres = await fetch(`http://localhost:8005/addcart/${id}`, {
      // method: "POST",
      // headers: {
      //   Accept: "application/json",
      //   "Content-type": "application/json",
      // },

      // mode: "cors",
      // credentials: "include",
      method: "POST",
      mode: "cors",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inddata,
      }),
    });

    const data1 = await checkres.json();
    console.log(data1);

    if (checkres.status === 401 || !data1) {
      console.log("User Invalid");
      alert("User Invalid");
    } else {
      // alert("data added in your cart");
      history("/buynow");
      setAccount(data1);
    }
  };

  return (
    <div className="cart_section">
      {inddata && Object.keys(inddata).length && (
        <div className="cart_container">
          <div className="left_cart">
            <img src={inddata.url} alt="cart_img" />
            <div className="cart_btn">
              <button
                className="cart_btn1"
                onClick={() => addtocart(inddata.id)}
              >
                Add to Cart
              </button>
              <button className="cart_btn2">Buy Now</button>
            </div>
          </div>
          <div className="right_cart">
            <h3>{inddata.title.shortTitle}</h3>
            {<h4>{inddata.title.longTitle}</h4>}
            <Divider />
            <p className="mrp">M.R.P. :₹{inddata.price.mrp}</p>
            <p>
              {" "}
              Deal of the Day :{" "}
              <span style={{ color: "#B12704" }}>₹{inddata.price.cost}</span>
            </p>
            <p>
              {" "}
              You save :{" "}
              <span style={{ color: "#B12704" }}>
                {inddata.price.mrp - inddata.price.cost}(
                {inddata.price.discount})
              </span>
            </p>

            <div className="discount_box">
              <h5>
                Discount :
                <span style={{ color: "#111" }}>{inddata.discount}</span>
              </h5>
              <h4>
                Free Delievery :
                <span style={{ color: "#111", fontWeight: 600 }}>Oct 8-21</span>{" "}
                Details
              </h4>
              <p>
                Fastest delievery :
                <span style={{ color: "#111", fontWeight: 600 }}>
                  Tomarrow 11AM
                </span>
              </p>
            </div>

            <p className="description">
              About the Item :{" "}
              <span
                style={{
                  color: "#565959",
                  fontSize: 14,
                  fontWeight: 500,
                  letterSpacing: "0.4px",
                }}
              >
                {inddata.description}
              </span>
            </p>
          </div>
        </div>
      )}
      {!inddata ? (
        <div className="circle">
          <CircularProgress />
          <h2>Loading...</h2>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Cart;
