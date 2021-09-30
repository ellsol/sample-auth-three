const express = require('express')
const app = express();
const port = 8000;
var jwt = require('jsonwebtoken');
var jwksClient = require('jwks-rsa');


var client = jwksClient({
  jwksUri: 'http://34.141.25.42/.well-known/jwks.json'
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    console.log("Key: " + JSON.stringify(key))
    var signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];  

    const options = {
      audience:  "http://localhost:8000"
    }
    jwt.verify(token, getKey, options, function (err, claims) {
      if (err) {
        res.sendStatus(401);
        return
      }

      console.log(claims) // bar 
 
      req.user = {
        id: claims.sub,
        role: claims.role
      };
      next()
    });

  } else {
    res.sendStatus(401);
  }
};

app.get('/me', authenticateJWT, (req, res) => {
  res.json(req.user);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});
