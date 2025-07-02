const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
        return res.status(401).json({ error: "Login Unsuccessfull" });
        }

        const decoded = jwt.verify(token , process.env.JWT_SECRET);
        req.user = decoded.id;
        next();
    }catch(err){
        return res.status(401).json({ error: "Invalid or expired token." });
    }    
}

module.exports = requireAuth;