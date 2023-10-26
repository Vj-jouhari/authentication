const UsersModel = require("../Models/UsersModel");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET;
const logger = require('../utils/log');

exports.registerUser = async (req, res) =>{
    try {
      const {name, email, password,phoneNumber} = req.body;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const randomOtp = Math.floor(100000 + Math.random() * 900000);  
      const isEmail = await UsersModel.findOne({email:email});
      // check email existence
      if(isEmail){
        logger.info('Email Exist Already', {data:req.body});
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
          logger.info('Registration Successfull', {data:val});
          res.status(200).json({
            status: 200,
            message: 'Registration Successfull',
            data: val,
          });
        })
      }
    } catch (error) {
    logger.info('Something Went wrong', error);
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
      logger.info('Login Failed, Either Email or Password doesnot match with the record', req.body);
      res.status(401).json({
        status: 401,
        message: "You are not authorized",
      });
      return;
    }
    if(!(user.isStatus && user.isEmailVerified)){
      logger.info('Not verified or Status is  Inactive, Please Verify', req.body);
      res.status(401).json({
        status: 401,
        message: "You are not authorized",
      });
      return;
    }
    try {
      const otpSend = await sendOtp(user);
      res.status(200).json({
        status: 200,
        message: "OTP send Successfully",
      });
    } catch (otpError) {
      console.error('Error sending OTP:', otpError);
      return res.status(500).json({
        status: 500,
        message: 'Error sending OTP',
        error: otpError.message,
      });
    }    
  } catch (error) {
    logger.info('Something Went wrong', error);
    res.status(500).json({
      status: 500,
      message: 'Internal server error',
      error: error.message,
    });
  }
}

exports.dashboard = async (req, res, next)=>{
  try {
    const userDetail = await UsersModel.findOne({email:req.user.email},{password:0});
    if(!userDetail){
      res.status(400).json({
        status:400,
        message:"Something went wrong"
      })
    }
    res.status(200).json({
      status: 200,
      message: "Authorized User",
      data:userDetail
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error
    });
  }
}

const sendOtp = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      const client = require('twilio')(accountSid, authToken);
      const otpVerification = Math.floor(100000 + Math.random() * 900000);
      const updatedUser = await UsersModel.findOneAndUpdate({email:data.email},{otp:otpVerification},{new:true});
      const dynamicMessage = `Hello, ${updatedUser.name}! Your OTP is ${updatedUser.otp}`;
      const message = await client.messages.create({
        body: dynamicMessage,
        from: '+19292442041',
        to: '+919956889313',
      });
      resolve(message.sid);
    } catch (error) {
      reject(error);
    }
  });
};

exports.verifyOtp = async (req, res) =>{
  const {email, otp} = req.body;
  try {
    const userotpDetail = await UsersModel.findOne({email:email});
    if(!userotpDetail){
      res.status(400).json({
        status:400,
        message:"Something went wrong"
      })
    }
    if(userotpDetail.otp != otp){
      res.status(400).json({
        status:400,
        message:"OTP Does not Match"
      })
    }else{
      const token = jwt.sign({ userId: userotpDetail._id, email: userotpDetail.email }, secretKey, { expiresIn: '1h' });
      res.status(200).json({
        status: 200,
        message: "OTP verified Successfully",
        data:token
      });
    }

  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error
    });
  }
}

exports.forgetPassword = async (req, res, next) => {

}