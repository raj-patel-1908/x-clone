import express from "express";

import { signupController, loginController, logoutController } from "../controllers/auth.controllers.js";

const router = express.Router();

router.post("/signup", signupController);
router.post("/login", loginController);
router.post("/logout", logoutController)

router.all("*", (req, res) => {
    res.status(404).json({
        success: "false",
        message: "404 not found",
    });
})

export default router;