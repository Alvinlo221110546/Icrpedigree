import {
  createUserProfile,
  getProfileByUserId,
  updateUserProfile,
  
} from "../Models/catConnectModel.js";

/* ============================================================
   GET PROFILE BY USER ID
============================================================ */

export const getUserProfileController = async (req, res) => {
  try {
    const user_id = req.params.user_id;

    const profile = await getProfileByUserId(user_id);

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    return res.json(profile);
  } catch (err) {
    console.error("❌ getUserProfile error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};


/* ============================================================
   CREATE NEW PROFILE
============================================================ */

export const createUserProfileController = async (req, res) => {
  try {
    const data = req.body;

    const id = await createUserProfile(data);

    return res.status(201).json({
      message: "Profile created successfully",
      id
    });
  } catch (err) {
    console.error("❌ createUserProfile error:", err);

    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ message: "Profile already exists for this user_id" });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
};


/* ============================================================
   UPDATE PROFILE (PUT)
============================================================ */

export const updateUserProfileController = async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const data = req.body;

    const existing = await getProfileByUserId(user_id);

    if (!existing) {
      return res.status(404).json({ message: "Profile not found" });
    }

    await updateUserProfile(user_id, data);

    return res.json({
      message: "Profile updated successfully",
      updated: { user_id, ...data }
    });

  } catch (err) {
    console.error("❌ updateUserProfile error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};







