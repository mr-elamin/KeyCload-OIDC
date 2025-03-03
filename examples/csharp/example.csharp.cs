using System;
using System.Net.Http;
using System.Threading.Tasks;
using IdentityModel.Client;

class Program
{
    static async Task Main(string[] args)
    {
        var client = new HttpClient();

        // Discover endpoints from metadata
        var disco = await client.GetDiscoveryDocumentAsync("https://keycloak.mr-elamin.com/realms/test-realm");
        if (disco.IsError)
        {
            Console.WriteLine(disco.Error);
            return;
        }

        // Request token
        var tokenResponse = await client.RequestPasswordTokenAsync(new PasswordTokenRequest
        {
            Address = disco.TokenEndpoint,
            ClientId = "your-client-id",
            ClientSecret = "your-client-secret",
            UserName = "your-username",
            Password = "your-password",
            Scope = "openid email"
        });

        if (tokenResponse.IsError)
        {
            Console.WriteLine(tokenResponse.Error);
            return;
        }

        Console.WriteLine(tokenResponse.Json);
    }
}