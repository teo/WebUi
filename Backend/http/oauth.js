const https = require('https');
const oauth2 = require('simple-oauth2');
const log = require('./../log/log.js');
const assert = require('assert');

/**
 * Authenticates users via CERN OAuth 2.0.
 * Gathers user account details.
 * @todo e-group authorization
 * @author Adam Wegrzynek <adam.wegrzynek@cern.ch>
 */
class OAuth {
  /**
   * Creates OAuth object based on id and secret stored in config file.
   * @param {object} config - configuration object (see docs for details)
   * @constructor
   */
  constructor(config) {
    assert(config.id, 'Config value "id" is mandatory');
    assert(config.secret, 'Config value "secret" is mandatory');
    assert(config.tokenHost, 'Config value "tokenHost" is mandatory');
    assert(config.tokenPath, 'Config value "tokenPath" is mandatory');
    assert(config.authorizePath, 'Config value "authorizePath" is mandatory');
    assert(config.redirect_uri, 'Config value "redirect_uri" is mandatory');
    assert(config.egroup, 'Config value "egroup" is mandatory');
    assert(config.resource.port, 'Config value "resource.port" is mandatory');
    assert(config.resource.hostname, 'Config value "resource.hostname" is mandatory');
    assert(config.resource.userPath, 'Config value "resource.userPath" is mandatory');
    assert(config.resource.groupPath, 'Config value "resource.groupPath" is mandatory');

    this.oauthCreds = oauth2.create({
      client: {
        id: config.id,
        secret: config.secret
      },
      auth: {
        tokenHost: config.tokenHost,
        tokenPath: config.tokenPath,
        authorizePath: config.authorizePath
      }
    });

    this.redirectUri = config.redirect_uri;
    this.userOptions = {
      host: config.resource.hostname,
      port: config.resource.port,
      path: config.resource.userPath
    };
    this.groupOptions = {
      host: config.resource.hostname,
      port: config.resource.port,
      path: config.resource.groupPath
    };
    this.scope = 'https://' + config.resource.hostname + config.resource.userpath;
    this.egroup = config.egroup;
  }

  /**
   * Returns autorization URL
   * @param {string} state - Base64 encoded parameters
   * @return {object} authorizeURL
   */
  getAuthorizationUri(state) {
    return this.oauthCreds.authorizationCode.authorizeURL({
      redirect_uri: this.redirectUri,
      scope: this.scope,
      state: state
    });
  }

  /**
   * Creates access_token based on code parameters.
   * Retrive some user's and group information from resource server using access_token.
   * @param {number} code - authorization code to request access token
   * @return {object} Promise with user details and token
   */
  createTokenAndProvideDetails(code) {
    return new Promise((resolve, reject) => {
      this.oauthCreds.authorizationCode.getToken({code, redirect_uri: this.redirectUri})
        .then((result) => {
          return this.oauthCreds.accessToken.create(result);
        }).then((token) => {
          return Promise.all([
            this.getDetails(token.token.access_token, this.userOptions),
            this.getDetails(token.token.access_token, this.groupOptions)
          ]);
        }).then((result) => {
          const details = {
            user: result[0],
            group: result[1]
          };

          // E-group authorization (verify that user is subscribed to the e-group)
          if (!details.group.groups.find((group) => group === this.egroup)) {
            reject(new Error('e-groups restriction'));
          }

          resolve(details);
        }).catch((error) => {
          reject(error);
        });
    });
  }

  /**
   * Queries details using received access token.
   * @param {string} token - OAuth access token
   * @param {object} options POST options
   * @return {object} Promise with user details
   */
  getDetails(token, options) {
    return new Promise((resolve, reject) => {
      const postOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'text',
          'Authorization': 'Bearer ' + token
        }
      };
      Object.assign(postOptions, options);
      let response = [];
      const req = https.request(postOptions, (res) => {
        res.on('data', (chunk) => {
          response.push(chunk);
        }).on('end', () => {
          if (res.statusCode !== 200) {
            return reject(new Error(res.statusMessage));
          }

          let userdata;
          try {
            userdata = JSON.parse(response.join(''));
          } catch(e) {
            return reject(new Error('Unable to parse user details answer'));
          }

          userdata.oauth = token;
          resolve(userdata);
        }).on('error', (err) => {
          reject(err);
        });
      });

      req.on('error', (err) => {
        reject(err);
      });
      req.end();
    });
  }
}
module.exports = OAuth;
