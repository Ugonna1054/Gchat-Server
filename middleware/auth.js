const jwt = require('jsonwebtoken');
const config = require('config');


const auth = {
    auth: async (req, res, next) => {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(" ")[1]
        }

        if (!token) return res.status(401).send('Access Denied');

        try {
            const decoded = jwt.verify(token, config.get('myPrivateKey'));
            req.user = decoded; //we now have access to the users request like req.user._id
            next()
        }

        catch (err) {
            res.status(401).send('Invalid/Expired Token')
        }
    },
    admin: async (req, res, next) => {
        if (!req.user.isAdmin) return res.status(403).send('Acces Denied..only Admins')
        next()
    }
}

module.exports = auth