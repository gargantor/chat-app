const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {    
    try {                
        if (!req.headers.authorization) throw "Forbidden!!";        
        const token = req.headers.authorization.split(" ")[1];
        const payload = jwt.verify(token, process.env.SECRET);
        //console.log(payload);    

        req.payload = payload;
        next()
    } catch (err) {
        res.status(401).json({
            message: "Forbidden 401",
        });
    }
}