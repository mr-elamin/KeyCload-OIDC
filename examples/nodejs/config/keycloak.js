import * as client from 'openid-client';

export async function getClient() {
  const server = new URL('https://keycloak.mr-elamin.com/realms/test-realm/.well-known/openid-configuration');
  const config = await client.discovery(server);
  const keycloakClient = new client.Client({
    client_id: 'myclient',
    client_secret: 'your-client-secret', // Optional if public client
    redirect_uris: ['https://www.keycloak.org/app/#url=https://keycloak.mr-elamin.com&realm=test-realm&client=myclient'],
    response_types: ['code'],
    token_endpoint_auth_method: 'client_secret_post',
  });
  return keycloakClient;
}