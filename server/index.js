const express = require('express')
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');


const port = process.env.SERVER_PORT || 8001;
const issuer = process.env.ISSUER_BASE_URL || 'http://localhost:8080';
const audience = process.env.AUDIENCE || 'http://localhost:8001';


/*
  auth middleware
 */
const client = jwksClient({
    jwksUri: issuer + '/.well-known/jwks'
});

function getKey(header, callback) {
    client.getSigningKey(header.kid, function (err, key) {
        if(err) {
            console.log(err)
            callback(err, null)
            return
        }
        console.log(key)
        const signingKey = key.publicKey || key.rsaPublicKey;
        callback(null, signingKey);
    });
}

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        const options = {
            audience: audience
        }
        jwt.verify(token, getKey, options, function (err, claims) {
            if (err) {
                console.log(err)
                res.sendStatus(401);
                return
            }
            req.user = {
                erc725ControllerKey: claims.sub,
                erc725Address: claims.erc725Address
            };
            next()
        });
    } else {
        res.sendStatus(401);
    }
};


/*
  HTTP Server
 */

// turn off cors
app.use(cors())

/*
  Example endpoint /me

  With a valid token it will return the controller key
 */
app.get('/me', authenticateJWT, (req, res) => {
    console.log(req.user)
    res.json(req.user);
});


app.listen(port, () => {
    console.log(`Audience: ${audience}`);
    console.log(`IP Service: ${issuer}`);
    console.log(`Listening on port ${port}...`);
});
