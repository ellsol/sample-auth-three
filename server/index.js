const express = require('express')
const app = express();
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');


const port = process.env.SERVER_PORT || 8000;
const issuer = process.env.ISSUER_BASE_URL || 'http://localhost:8080';
const audience = process.env.AUDIENCE || 'http://localhost:8000';


const client = jwksClient({
  jwksUri: issuer + '/.well-known/jwks.json'
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];  

    const options = {
      audience:  audience
    }
    jwt.verify(token, getKey, options, function (err, claims) {
      if (err) {
        res.sendStatus(401);
        return
      }

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

/*
  Example endpoint /me

  With a valid token it will return the controller key
 */
app.get('/me', authenticateJWT, (req, res) => {
  res.json(req.user);
});

app.listen(port, () => {
  console.log(`Audience: ${audience}`);
  console.log(`IP Service: ${issuer}`);
  console.log(`Listening on port ${port}...`);
});
