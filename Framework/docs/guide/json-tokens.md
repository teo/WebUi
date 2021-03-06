# Backend - JSON Web Token module
JSON Web Tokens allow to secure requests or claims send between client and server - see more details at https://jwt.io
This module is required by [http](http-server.md) and [websockets](websockets.md) modules.
 * Generate JWT tokens that includes encrypted ID, username and auth level
 * Verify token and decode encrypted data on the server side
 * Refresh tokens if `maxAge` parameter is not expired

See [API reference](../reference/backend.md##jwttoken) for more details.

### Instance
```js
JwtToken(JWT_CONF);
```
Where
 `JWT_CONF` JSON formatted configuration object for JWT with following defined fields:
   * `secret` - JWT secret passphrase to sign and verify tokens
   * `expiration` - token expiration time (as time literal)
   * [`issuer`] - name of token issuer
   * [`maxAge`] - token refresh expiration time (as time literal)

### Code example
```js
// Include module
const {JwtToken} = require('@aliceo2/aliceo2-gui');

// JWT configuration
const jwtConf = {
  "secret": "secret",
  "expiration": "1d",
};

// Create instance of jwt module
const jwt = new JwtToken(jwtConf);

// Generate a token
const token = jwt.generateToken(1, 'code-example');

// Verify a token
jwt.verify(token)
  .then(() => {
    cosole.log('Access granted !');
  });
}
```
