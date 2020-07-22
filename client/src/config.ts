// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'j7jfc5ymp2'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-2.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'gauravhanda.us.auth0.com',            // Auth0 domain
  clientId: 'hz1kkrv5eLtLT4sBlJdRTcQkfJM0I0eY',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
