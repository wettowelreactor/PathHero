'use strict';
var secrets;
try {
  secrets = require('./secrets');
}
catch(err) {
  secrets = {};
}

var facebook = secrets.facebook || {
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackUrl: 'http://create.pathhero.com/login/facebook/callback',
  redirect_uri: 'http://create.pathhero.com/login/facebook/callback'
};

var github = secrets.github || {
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackUrl: 'http://create.pathhero.com/login/github/callback'
};

var google = secrets.google || {
  consumerKey: process.env.GOOGLE_CONSUMER_KEY,
  consumerSecret: process.env.GOOGLE_CONSUMER_SECRET,
  callbackUrl: 'http://create.pathhero.com/login/google/callback',
  redirect_uri: 'http://create.pathhero.com/login/google/callback'
};

var twitter = secrets.twitter || {
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callbackUrl: 'http://create.pathhero.com/login/twitter/callback'
};

var sessionKey = secrets.sessionKey || process.env.SESSION_KEY;

module.exports = {
  domain: 'pathhero.com',
  createSubdomain: 'create',
  playSubdomain: 'play',
  facebook: facebook,
  github: github,
  google: google,
  twitter: twitter,
  sessionKey: sessionKey
};
