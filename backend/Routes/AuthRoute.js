import express from "express";
import {  deleteProfileByIdController, deleteProfileController, forgetPasswordController, getAllProfilesController, getProfileController, loginController, registerController, registerOTPController, resetPasswordController, updateProfileController } from "../Controllers/AuthController.js";
import { isAdmin, requireSignIn } from "../Middleware/AuthMiddleware.js";



const router = express.Router();

router.post('/registerotp',registerOTPController);
router.post('/register', registerController);
router.post('/login', loginController);
router.post('/forgetpassword', forgetPasswordController );
router.post('/resetPassword', resetPasswordController);
router.put('/updateprofile', requireSignIn , updateProfileController);
router.get('/getprofile', requireSignIn, getProfileController);
router.get('/getallprofile',requireSignIn,isAdmin, getAllProfilesController);
router.delete('/deleteprofile',requireSignIn, deleteProfileController);
router.delete('/profile/:userId', deleteProfileByIdController);


//protected User route auth
router.get('/userdashboard', requireSignIn , (req, res) => {
    res.status(200).send({ ok: true});
  });

  //protected Admin route auth
  router.get('/admindashboard', requireSignIn , isAdmin, (req, res) => {
    res.status(200).send({ ok: true});
  });






    

export default router;