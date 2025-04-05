import passport from "passport";
import {
    authWithGoogle,
  fetchUserData,
  loginWithPassword,
  signUpWithPassword,
} from "../controllers/AuthController";
import express from "express"

// Make sure you're importing and initializing the router correctly
const router = express.Router();

router.get("/",(req,res)=>{
    res.send("Auth Route Active")
})
router.post("/login", loginWithPassword);
router.post("/signup", signUpWithPassword);
router.post("/fetch-user",fetchUserData)
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  authWithGoogle
);

export default router;
