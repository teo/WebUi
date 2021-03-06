# Backend - HTTP module
HTTP module provided a simple way of createing REST API. In addition, it supports:
 - CERN OAuth 2 authentication and e-groups authorization using [OAuth](oauth.md) module
 - JWT token secured requests using [JWT](json-tokens.md) module
 - Protects server by defining: Content Security Policy, DNS Prefech Control, `X-Frame-Options`, `Strict-Transport-Security`, `Referrer-Policy`, `X-XSS-Protection`
 - Serving custom static paths
 - Defining new routes (GET, POST)
 - Passing values to frontend easily

See [API reference](../reference/backend.md#httpserver) for more details.

#### Instance
```js
HttpServer(HTTP_CONF, JWT_CONF, [OAUTH_CONF]);
```
Where:
 * `HTTP_CONF` consists of following fields:
     * `port` - HTTP port number 
     * `tls` - flag that enables/disables TLS
     * `hostname` - server's hostname which is required by Content Security Policy
     * [`portSecure`] - HTTPS port number
     * [`key`] - private key filepath
     * [`cert`] - certificate filepath
 * `JWT_CONF` JSON Web token configuration is explained in the [jwt](json-tokens.md) module
 * [`OAUTH_CONF`] OAuth confguration is explained in the [oauth](oauth.md) module

#### Code example
```js
// Include required modules
const {HttpServer, JwtToken} = require('@aliceo2/aliceo2-gui');

// configuration file for simple, unsecured http server
const httpConf = {
  port: 8080,
  tls: false,
  hostname: 'localhost'
};

// JWT configuration (follow instruction from jwt module)
const jwtConf = {...};

// create instance of http server
const http = new HttpServer(httpConf, jwtConf);

// pass test value to the frontend (via URL)
http.passAsUrl('testKey', 'testValue');

// Server public folder under `/pub` URI
http.addStaticPath('public', 'pub');
```
