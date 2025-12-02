import express from "express";
import * as Animal from "../Controller/catController.js";
import { authRequired } from "../Middleware/auth.js";

const router = express.Router();

/* ============================
   🔥 UPLOAD FOTO (PENTING: TARUH DI ATAS /:id)
=============================== */
router.put("/update-photo/:id", authRequired, Animal.updateCatPhoto);

/* ============================
   🐱 CRUD Cat
=============================== */
router.get("/", authRequired, Animal.getAnimals);
router.post("/", authRequired, Animal.createAnimal);

/* ============================
   🧬 Pedigree Tree (HARUS DI ATAS /:id)
=============================== */
router.get("/:id/pedigree", authRequired, Animal.getPedigreeTree);

/* ============================
   🔐 Blockchain Hash Check
=============================== */
router.get("/:id/check", authRequired, Animal.verifyHashIntegrity);

/* ============================
   📄 Pedigree Scan
=============================== */
router.post("/scan", authRequired, Animal.insertPedigreeScan);

/* ============================
   🐾 GET, UPDATE, DELETE CAT
=============================== */
router.get("/:id", authRequired, Animal.getAnimal);
router.put("/:id", authRequired, Animal.editAnimal);
router.delete("/:id", authRequired, Animal.removeAnimal);

export default router;
