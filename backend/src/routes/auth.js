const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/auth");
const {
  RegisterValidator,
  RegisterManagerValidator,
  LoginValidator,
} = require("../middleware/validators");
const auth = require("../middleware/auth");
router.get("/me", auth, AuthController.GetMyProfile);
router.post("/login", LoginValidator, AuthController.Login);
router.post(
  "/registerLabeller",
  RegisterValidator,
  AuthController.RegisterLabeller
);
router.post("/addObject", AuthController.addObject);
router.post("/getPics", AuthController.getPics);
router.get("/getObject", AuthController.getObject);
router.post("/deleteObject", AuthController.deleteObject);
router.post(
  "/registerManager",
  RegisterManagerValidator,
  AuthController.RegisterManager
);
router.post("/getLabeller", AuthController.getLabeller);
router.post("/getManager", AuthController.getManager);
router.post("/completeObj", AuthController.completeObject);
router.post("/changeStatus", AuthController.changeStatus);
router.post("/verifyManager", auth, AuthController.verifyManager);
router.post("/getOneObject", AuthController.getOneObject);
router.get("/getLabellersList", AuthController.getLabellerList);
router.put("/updateProfile", AuthController.updateProfile);
router.put("/changePassword", AuthController.changePassword);

module.exports = router;
