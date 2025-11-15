import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    region: 'us-east-2',
    userPoolId: 'us-east-2_ytDRYiJVg',
    userPoolWebClientId: '46ghrvb98nfhtna8lc9kqcojb2',
    oauth: {
      domain: 'https://weatherdriver.auth.us-east-2.amazoncognito.com',
      scope: ['openid', 'email', 'profile'],
      redirectSignIn: 'exp://localhost:19000/--/',
      redirectSignOut: 'exp://localhost:19000/--/',
      responseType: 'code',
    },
  },
});
