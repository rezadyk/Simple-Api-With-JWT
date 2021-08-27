const router = require("express").Router();
const apiController = require("../controllers/apiController");
const auth = require("../middlewares/authenticateToken");

router.get("/", auth.authenticateToken, apiController.index);
router.put("/update/:id", auth.authenticateToken, apiController.update);
router.post("/auth", apiController.auth);
router.post("/token", apiController.token);
router.delete("/logout", apiController.logout);

router.post("/add", auth.authenticateToken, apiController.add);

module.exports = router;
