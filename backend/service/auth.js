const jwt = require('jsonwebtoken');
const SecretKey = process.env.Secret_key || "BMWm8BuyItBefore28yearOld";

// Create JWT Token
const CreateTokenForUser = (user) => {
    if (!user || !user._id) {
        throw new Error('User not found!!!');
    }

    const payload = {
        _id: user._id.toString(),
        fullname: user.fullname || "",
        email: user.email || ""
    };

    return jwt.sign(payload, SecretKey, { expiresIn: '7d' }); 
};

// Validate JWT Token
const validateUser = (token) => {
    if (!token) {
        throw new Error("Invalid Token or Token is Missing");
    }

    try {
        const decoded = jwt.verify(token, SecretKey); 
        return decoded;
    } catch (err) {
        throw new Error("Invalid Token or Secret key!");
    }
};

module.exports = {
    CreateTokenForUser,
    validateUser
};
