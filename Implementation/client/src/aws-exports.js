// // This file exports the configuration object for Amplify V6
// // We do NOT call Amplify.configure() here, we just export the settings.

// const awsExports = {
//   Auth: {
//     Cognito: {
//       // Your specific User Pool IDs
//       userPoolId: 'us-east-2_ytDRYiJVg',
//       userPoolClientId: '46ghrvb98nfhtna8lc9kqcojb2',
      
//       loginWith: {
//         oauth: {
//           // 1. Domain must NOT have "https://"
//           domain: 'weatherdriver.auth.us-east-2.amazoncognito.com',
          
//           // 2. Scopes matching your AWS Console
//           scopes: ['openid', 'email', 'profile'],
          
//           // 3. Redirects must be ARRAYS, not strings.
//           // We include both the Expo dev URL and your production/standalone scheme.
//           redirectSignIn: ['exp://localhost:19000/--/', 'weatherdriver://'],
//           redirectSignOut: ['exp://localhost:19000/--/', 'weatherdriver://'],
          
//           responseType: 'code',
//           providers: ['Google']
//         }
//       }
//     }
//   }
// };

// export default awsExports;
// This file exports the configuration object for Amplify V6
// We do NOT call Amplify.configure() here, we just export the settings.

const awsExports = {
  Auth: {
    Cognito: {
      // Your specific User Pool IDs
      userPoolId: 'us-east-2_ytDRYiJVg',
      userPoolClientId: '46ghrvb98nfhtna8lc9kqcojb2',
      
      loginWith: {
        oauth: {
          // 1. Domain must NOT have "https://"
          domain: 'weatherdriver.auth.us-east-2.amazoncognito.com',
          
          // 2. Scopes matching your AWS Console
          scopes: ['openid', 'email', 'profile'],
          
          // 3. Redirects must be ARRAYS, not strings.
          // We force the app to use the custom scheme to avoid "localhost" connection errors on physical devices.
          redirectSignIn: ['weatherdriver://'],
          redirectSignOut: ['weatherdriver://'],
          
          responseType: 'code',
          providers: ['Google']
        }
      }
    }
  }
};

export default awsExports;