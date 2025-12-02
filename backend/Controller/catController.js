// src/Controller/catController.js
import * as Cat from "../Models/catModel.js";
import Tesseract from "tesseract.js";

/* ============================================================
   GET ALL CATS (optional filter by user_id)
============================================================ */
export const getAnimals = async (req, res) => {
  try {
    const { user_id } = req.query; // bisa dari query string atau auth token
    let cats;

    if (user_id) {
      cats = await Cat.getCatsByUserId(user_id);
    } else {
      cats = await Cat.getAllCats();
    }

    res.json({ success: true, data: cats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ============================================================
   GET ONE CAT BY ID
============================================================ */
export const getAnimal = async (req, res) => {
  try {
    const cat = await Cat.getCatById(req.params.id);
    if (!cat) return res.status(404).json({ success: false, message: "Cat not found" });

    res.json({ success: true, data: cat });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ============================================================
   CREATE CAT
============================================================ */
export const createAnimal = async (req, res) => {
  try {
    const { user_id, ...catData } = req.body;

    if (!user_id) {
      return res.status(400).json({ success: false, message: "user_id is required" });
    }

    const id = await Cat.insertCat({ ...catData, user_id });

    res.json({
      success: true,
      message: "Cat created successfully",
      id,
    });
  } catch (err) {
    console.error("InsertCat Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ============================================================
   UPDATE CAT
============================================================ */
export const editAnimal = async (req, res) => {
  try {
    const { user_id } = req.body; // biasanya dari auth token
    const cat = await Cat.getCatById(req.params.id);

    if (!cat) return res.status(404).json({ success: false, message: "Cat not found" });
    if (cat.user_id !== user_id) {
      return res.status(403).json({ success: false, message: "You are not allowed to edit this cat" });
    }

    await Cat.updateCat(req.params.id, req.body);

    res.json({
      success: true,
      message: "Cat updated successfully",
    });
  } catch (err) {
    console.error("UpdateCat Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ============================================================
   DELETE CAT
============================================================ */
export const removeAnimal = async (req, res) => {
  try {
    const { user_id } = req.body; // biasanya dari auth token
    const cat = await Cat.getCatById(req.params.id);

    if (!cat) return res.status(404).json({ success: false, message: "Cat not found" });
    if (cat.user_id !== user_id) {
      return res.status(403).json({ success: false, message: "You are not allowed to delete this cat" });
    }

    await Cat.deleteCat(req.params.id);

    res.json({
      success: true,
      message: "Cat removed successfully",
    });
  } catch (err) {
    console.error("DeleteCat Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ============================================================
   UPDATE PHOTO (Upload to Cloudinary optional)
============================================================ */
export const updateCatPhoto = async (req, res) => {
  try {
    const { id } = req.params;
    const { photo_url, photo_public_id, user_id } = req.body;

    if (!photo_url) {
      return res.status(400).json({ success: false, message: "photo_url is required" });
    }

    const cat = await Cat.getCatById(id);
    if (!cat) return res.status(404).json({ success: false, message: "Cat not found" });
    // if (cat.user_id !== user_id) {
    //   return res.status(403).json({ success: false, message: "You are not allowed to update this cat" });
    // }

    await Cat.updateCat(id, {
      profile_image_url: photo_url,
      profile_image_public_id: photo_public_id || null
    });

    res.json({
      success: true,
      message: "Photo updated successfully",
      photo_url,
      photo_public_id
    });

  } catch (err) {
    console.error("Photo Update Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ============================================================
   PEDIGREE TREE (Recursive)
============================================================ */
export const getPedigreeTree = async (req, res) => {
  try {
    const buildTree = async (id) => {
      if (!id) return null;

      const cat = await Cat.getCatById(id);
      if (!cat) return null;

      return {
        ...cat,
        sire: await buildTree(cat.sire_id),
        dam: await buildTree(cat.dam_id)
      };
    };

    const tree = await buildTree(req.params.id);

    res.json({ success: true, data: tree });
  } catch (err) {
    console.error("Pedigree Tree Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ============================================================
   HASH INTEGRITY CHECK
============================================================ */
export const verifyHashIntegrity = async (req, res) => {
  try {
    const cat = await Cat.getCatById(req.params.id);
    if (!cat) return res.status(404).json({ success: false, message: "Cat not found" });

    const pedigree_hash = Cat.__test_generatePedigreeHash
      ? Cat.__test_generatePedigreeHash(cat)
      : null;

    const valid = pedigree_hash === cat.pedigree_hash;

    res.json({
      success: true,
      valid,
      stored: cat.pedigree_hash,
      recalculated: pedigree_hash,
    });
  } catch (err) {
    console.error("Hash Integrity Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ============================================================
   INSERT PEDIGREE SCAN
============================================================ */
export const insertPedigreeScan = async (req, res) => {
  try {
    const { cat_id, scan_image } = req.body;

    if (!cat_id || !scan_image) {
      return res.status(400).json({ success: false, message: "cat_id dan scan_image wajib diisi" });
    }

    // Simpan record awal
    const id = await Cat.insertPedigreeScan({
      cat_id,
      scan_image,
      extracted_text: null,
      icr_status: "pending",
    });

    let extractedText = null;
    try {
      const result = await Tesseract.recognize(scan_image, "eng");
      extractedText = result.data.text;
    } catch (ocrErr) {
      console.error("OCR error:", ocrErr);
    }

    // Update hasil OCR
    await Cat.updatePedigreeScan(id, {
      extracted_text: extractedText,
      icr_status: "done",
    });

    res.json({
      success: true,
      message: "Scan inserted and text extracted",
      id,
      extracted_text: extractedText,
    });
  } catch (err) {
    console.error("Pedigree Scan Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
