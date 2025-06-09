const { validateUser } = require('../service/auth');

const CheckForAuthenticationoFTheCookies = (cookieName) => {
    return (req, res, next) => { 
        const tokenCookieValue = req.cookies[cookieName]; 
        if (!tokenCookieValue) {
            return res.status(401).send({
                message: 'Token in Cookies not Found!!!'
            });
        }

        try {
            const userPayload = validateUser(tokenCookieValue);
            req.user = userPayload;
            next(); 
        } catch (error) {
            return res.status(401).send({
                message: 'Yaha pr ha bhai error dhyaan se!',
            });
        }
    };
};

module.exports = {
    CheckForAuthenticationoFTheCookies
};
