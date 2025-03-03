from authlib.integrations.requests_client import OAuth2Session

client_id = 'your-client-id'
client_secret = 'your-client-secret'
redirect_uri = 'https://your-redirect-uri'
authorization_endpoint = 'https://keycloak.mr-elamin.com/realms/test-realm/protocol/openid-connect/auth'
token_endpoint = 'https://keycloak.mr-elamin.com/realms/test-realm/protocol/openid-connect/token'

session = OAuth2Session(client_id, client_secret, redirect_uri=redirect_uri)
authorization_url, state = session.create_authorization_url(authorization_endpoint)

print('Visit this URL to authorize:', authorization_url)

# After the user authorizes, they will be redirected to the redirect_uri with a code
authorization_response = input('Enter the full callback URL: ')

token = session.fetch_token(token_endpoint, authorization_response=authorization_response)
print('Access Token:', token)