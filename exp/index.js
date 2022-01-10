const https = require('https')
const options = {
    hostname: 'dev.auth-three.com',
    port: 443,
    path: '/.well-known/jwks',
    method: 'GET',
}
const req = https.request(options, res => {
    res.on('data', d => {
        process.stdout.write(d)
    })
})
req.on('error', error => {
    console.error(error)
})
req.end()
