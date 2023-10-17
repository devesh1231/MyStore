const express = require("express");
const router = new express.Router();
const Products = require("../models/productsSchema");
const USER = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const authenticate = require("../middleware/authenticate.js");
// get productsdata api
router.get("/getproducts", async (req, res) => {
  try {
    const productsdata = await Products.find();
    // console.log("console the data" + productsdata);
    res.status(201).json(productsdata);
  } catch (error) {
    console.log("error" + error.message);
  }
});

//get individiual data
router.get("/getproductsone/:id", async (req, res) => {
  try {
    const { id } = req.params;
    //console.log(id);

    const individualdata = await Products.findOne({ id: id });

    //console.log(individualdata);

    res.status(201).json(individualdata);
  } catch (error) {
    res.status(400).json(individualdata);
    console.log("error" + error.message);
  }
});

//register data
router.post("/register", async (req, res) => {
  console.log(req.body);

  const { fname, email, mobile, password, cpassword } = req.body;

  if (!fname || !email || !mobile || !password || !cpassword) {
    res.status(422).json({ error: "fill the all data" });
    console.log("no data available");
  }

  try {
    const preuser = await USER.findOne({ email: email });
    if (preuser) {
      res.status(422).json({ error: "this user is already present" });
    } else if (password !== cpassword) {
      res.status(422).json({ error: "password and cpassword not match" });
    } else {
      const finalUser = new USER({
        fname,
        email,
        mobile,
        password,
        cpassword,
      });

      //bcrypt js(one way communication )for encryption of password and when we login the we not decrypt password,only compare that matched or not.

      //password hashing process

      const storedata = await finalUser.save();
      console.log(storedata);

      res.status(201).json(storedata);
    }
  } catch (error) {}
});

//Login User api

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  if (!email || !password) {
    return res.status(400).json({
      error: "fill the all data",
    });
  }

  try {
    const userlogin = await USER.findOne({ email: email });
    console.log(userlogin + "user value");
    if (userlogin) {
      const isMatch = await bcrypt.compare(password, userlogin.password);
      console.log(isMatch + " pass match");

      //token generate

      // const token = await userlogin.generateAuthtokenn();
      // console.log(token);
      // res.cookie("Amazonweb", token, {
      //   expires: new Date(Date.now() + 900000),
      //   httpOnly: true,
      // });

      // console.log(`this is the cookie awesome ${res.cookies.Amazonweb}`);

      if (!isMatch) {
        return res.status(400).json({ error: "Invalid Details" });
      } else {
        const token = await userlogin.generateAuthtokenn();
        console.log(token);
        res.cookie("amazonweb", token, {
          expires: new Date(Date.now() + 2589000),
          httpOnly: true,
        });
        return res.status(201).json(userlogin);
      }
    } else {
      res.status(400).json({ error: "Invalid Details" });
    }
  } catch (error) {
    console.log("Signin error", error);
    return res.status(400).json({ error: "Invalid Details" });
  }
});

// adding the data into cart
router.post("/addcart/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const cart = await Products.findOne({ id: id });
    console.log(cart + "cart value");

    const UserContact = await USER.findOne({ _id: req.userID });
    console.log(UserContact);

    if (UserContact) {
      const cartData = await UserContact.addcartdata(cart);
      await UserContact.save();
      console.log(cartData);
      res.status(201).json(UserContact);
    } else {
      res.status(401).json({ error: "Invalid User" });
    }
  } catch (error) {
    res.status(401).json({ error: "Invalid User" });
  }
});

// get card details

router.get("/carddetails", authenticate, async (req, res) => {
  try {
    const buyuser = await USER.findOne({ _id: req.userID });

    return res.status(201).json(buyuser);
  } catch (error) {
    console.log("error" + error);
  }
});

//get valid user
router.get("/validuser", authenticate, async (req, res) => {
  try {
    const validuserone = await USER.findOne({ _id: req.userID });

    return res.status(201).json(validuserone);
  } catch (error) {
    console.log("error" + error);
  }
});

//remove item from cart

router.delete("/remove/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    req.rootUser.carts = req.rootUser.carts.filter((cruval) => {
      return cruval.id != id;
    });
    req.rootUser.save();
    res.status(201).json(req.rootUser);
    console.log("item remove");
  } catch (error) {
    console.log("error"+ error);
    res.status(400).json(req.rootUser);
  }
});


//for user logout


router.get("/logout",authenticate,(req,res)=>{
  try {
      req.rootUser.tokens=req.rootUser.tokens.filter((curelem)=>{
        return curelem.token!==req.token;
      });

      res.clearCookie("amazonweb",{path:"/"});

      req.rootUser.save();
      res.status(201).json(req.rootUser.tokens)
  } catch (error) {
    console.log("error for user logout")
  }
})

module.exports = router;
