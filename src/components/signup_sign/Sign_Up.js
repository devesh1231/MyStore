import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./signup.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; //for the massage for succesfully data added

const Sign_Up = () => {
  const [udata, setUdata] = useState({
    fname: "",
    email: "",
    mobile: "",
    password: "",
    cpassword: "",
  });

  const adddata = (e) => {
    const { name, value } = e.target;

    setUdata(() => {
      return {
        ...udata,
        [name]: value,
      };
    });
  };

  const senddata = async (e) => {
    e.preventDefault();
    const { fname, email, mobile, password, cpassword } = udata;

    const res = await fetch("http://localhost:8005/register", {
      method: "POST",
      headers: {
        "content-Type": "application/json",
      },
      body: JSON.stringify({
        fname,
        email,
        mobile,
        password,
        cpassword,
      }),
    });

    const data = await res.json();
    // console.log(data);

    if (res.status === 422 || !data) {
      // alert("no data");
      toast.warn("Invalid Details", {
        position: "top-center",
        theme: "dark",
      });
    } else {
      // alert("data successfully added");
      toast.success("data successfully added", {
        position: "top-center",
      });
      setUdata({
        ...udata,
        fname: "",
        email: "",
        mobile: "",
        password: "",
        cpassword: "",
      });
    }
  };

  return (
    <div>
      <section>
        <div className="sign_container">
          <div className="sign_header">
            <img src="./blacklogoamazon.png" alt="amazonlogo" />
          </div>

          <div className="sign_form">
            <form method="POST">
              <h1>Sign-Up</h1>
              <div className="form_data">
                <label htmlFor="fname">Your Name</label>
                <input
                  type="text"
                  name="fname"
                  onChange={adddata}
                  value={udata.fname}
                  id="fname"
                />
              </div>
              <div className="form_data">
                <label htmlFor="email">Email</label>
                <input
                  type="text"
                  name="email"
                  onChange={adddata}
                  value={udata.email}
                  id="email"
                />
              </div>
              <div className="form_data">
                <label htmlFor="number">Mobile</label>
                <input
                  type="text"
                  name="mobile"
                  onChange={adddata}
                  value={udata.mobile}
                  id="mobile"
                />
              </div>
              <div className="form_data">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  name="password"
                  onChange={adddata}
                  placeholder="At least 6 character"
                  id="password"
                />
              </div>
              <div className="form_data">
                <label htmlFor="password">Password Again</label>
                <input
                  type="password"
                  name="cpassword"
                  onChange={adddata}
                  value={udata.cpassword}
                  id="password"
                />
              </div>
              <button className="signin_btn" onClick={senddata}>
                Continue
              </button>
              <div className="signin_info">
                <p>Already have an account?</p>
                <NavLink to="/login">Signin</NavLink>
              </div>
            </form>
          </div>
          <ToastContainer />
        </div>
      </section>
    </div>
  );
};

export default Sign_Up;
