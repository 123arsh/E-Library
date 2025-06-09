const { Schema, model } = require('mongoose');
const { createHmac, randomBytes } = require('crypto');
const { CreateTokenForUser } = require('../service/auth');

// USER SCHEMA
const userData = new Schema({
    fullname: {
        type: String,
        required: true, // ✅ fixed typo
        index: true
    },
    email: {
        type: String,
        required: true, // ✅ fixed typo
        unique: true,
        index: true
    },
    password: {
        type: String,
        required: true, // ✅ fixed typo
        select: false,   // ✅ hide password by default
        index: true
    },
    salt: {
        type: String,
        required: false,
        select: false    // ✅ hide salt by default
    }
}, { timestamps: true });


// PRE-SAVE HOOK (hashing password before saving)
userData.pre('save', function (next) { // ✅ removed req, res
    if (!this.isModified('password')) return next();
    if (!this.password) return next(new Error('Password Required...'));

    const salt = randomBytes(16).toString('hex');
    const hashPassword = createHmac('sha256', salt)
        .update(this.password) // ✅ hashing actual password, not the string 'password'
        .digest('hex');

    this.salt = salt;
    this.password = hashPassword;

    next();
});


// STATIC METHOD (login logic)
userData.statics.MatchPasswordAndGenerateToken = async function (email, password) { // ✅ fixed method name
    const user = await this.findOne({ email }).select('+password +salt');
    if (!user) {
        throw new Error('User not Found!!!');
    }

    const userProvidedHash = createHmac('sha256', user.salt)
        .update(password)
        .digest('hex');

    if (user.password !== userProvidedHash) {
        throw new Error('Incorrect Email or Password!!!');
    }

    const token = CreateTokenForUser(user);
    return token;
};

const User = model('User', userData);
module.exports = User;
