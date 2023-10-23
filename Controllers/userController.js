const UsersModel = require("../Models/UsersModel");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET;


exports.registerUser = async (req, res) =>{
    try {
      const {name, email, password,phoneNumber} = req.body;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const randomOtp = Math.floor(100000 + Math.random() * 900000);  
      const isEmail = await UsersModel.findOne({email:email});
      // check email existence
      if(isEmail){
        res.status(409).json({
          status: 409,
          message: 'User already exists with the provided email',
          data: null,
        });
      }else{
        const saveUser = new UsersModel({
          name: name,
          email: email,
          password: hashedPassword,
          phoneNumber : phoneNumber,
          otp : randomOtp
        });
        
        saveUser.save().then(val => {
          res.status(200).json({
            status: 200,
            message: 'Registration Successfull',
            data: val,
          });
        })
      }
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: 'Internal server error',
        error: error.message,
      });
    }
}

exports.login = async (req, res, next) => {
  const {email, password} = req.body;
  try {
    const user = await UsersModel.findOne({email:email});
    if (!user || !bcrypt.compareSync(password, user.password)) {
      res.status(401).json({
        status: 401,
        message: "You are not authorized",
      });
      return;
    }
    if(!(user.isStatus && user.isEmailVerified)){
      res.status(401).json({
        status: 401,
        message: "You are not authorized",
      });
      return;
    }
    const token = jwt.sign({ userId: user._id, email: user.email }, secretKey, { expiresIn: '1h' });
    res.status(201).json({
      status: 201,
      message: "You are  authorized",
      data:token
    });
    
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Internal server error',
      error: error.message,
    });
  }
}


exports.dashboard = async (req, res, next)=>{
  res.status(200).json({
    status: 200,
    message: " authorized",
  });
}


// const verifyToken = (req, res, next) => {
//   const token = req.headers['authorization'];

  // if (!token) {
  //   return res.status(401).json({ message: 'Unauthorized' });
  // }

  // jwt.verify(token, secretKey, (err, decoded) => {
  //   if (err) {
  //     return res.status(401).json({ message: 'Token is not valid' });
  //   }

  //   req.user = decoded; // Attach user information to the request
  //   next();
  // });
// };