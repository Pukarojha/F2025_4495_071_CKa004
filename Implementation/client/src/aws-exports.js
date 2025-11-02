import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    region: 'us-east-2',
    userPoolId: '302933091929',
    userPoolWebClientId: '46ghrvb98nfhtna8lc9kqcojb2',
    oauth: {
      domain: 'YOUR_COGNITO_DOMAIN.auth.YOUR_REGION.amazoncognito.com',
      scope: ['openid', 'email', 'profile'],
      redirectSignIn: 'exp://localhost:19000/--/',
      redirectSignOut: 'exp://localhost:19000/--/',
      responseType: 'code',
    },
  },
});
