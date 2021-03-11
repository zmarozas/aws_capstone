const apiId = 'e8vrt7s2vj'
const region = 'us-east-1'
const devPort = '3050'

export const apiEndpoint = `https://${apiId}.execute-api.${region}.amazonaws.com/dev`
export const devapiEndpoint = `http://localhost:${devPort}/dev`
export const subDirectory = 'kanbancards'


export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-eq7g28uo.us.auth0.com',            // Auth0 domain
  clientId: 'Z6XCBOwuZepZI5Se1Zl4fPlGXP0YbOjN',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
