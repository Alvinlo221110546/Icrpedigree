import express from "express";
import {
  getUserProfileController,
  createUserProfileController,
  updateUserProfileController,
} from "../Controller/pedigreeConnectController.js";

const router = express.Router();

// Profile
router.get("/profile/:user_id", getUserProfileController);
router.post("/profile", createUserProfileController);
router.put("/profile/:user_id", updateUserProfileController);


export default router;
