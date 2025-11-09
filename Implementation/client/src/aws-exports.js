// src/aws-exports.js
import { Amplify } from 'aws-amplify';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

const redirectUri = makeRedirectUri({
  scheme: 'myapp',
  useProxy: true, // works with exp.direct tunnels
});

Amplify.configure({
  Auth: {
    region: 'us-east-2',
    userPoolId: 'us-east-2_ytDRYiJVg',
    userPoolWebClientId: '46ghrvb98nfhtna8lc9kqcojb2',
    oauth: {
      domain: 'weatherdriver.auth.us-east-2.amazoncognito.com',
      scope: ['openid', 'email', 'profile'],
      redirectSignIn: redirectUri,
      redirectSignOut: redirectUri,
      responseType: 'code',
    },
  },
});
