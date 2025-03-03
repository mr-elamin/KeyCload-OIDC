import path from 'node:path';
import AutoLoad from '@fastify/autoload';
import fastifyCookie from '@fastify/cookie';
import fastifySession from '@fastify/session';
import fastifyPassport from 'fastify-passport';
import { Strategy as OpenIDConnectStrategy } from 'passport-openidconnect';
import { getClient } from './config/keycloak.js';

export const options = {};

export default async function (fastify, opts) {
  fastify.register(fastifyCookie);
  fastify.register(fastifySession, {
    secret: 'a-very-secret-key',
    cookie: { secure: false },
    saveUninitialized: false,
    resave: false,
  });

  fastify.register(fastifyPassport.initialize());
  fastify.register(fastifyPassport.secureSession());

  const client = await getClient();

  const strategy = new OpenIDConnectStrategy(
    {
      issuer: client.issuer,
      authorizationURL: client.issuer.authorization_endpoint,
      tokenURL: client.issuer.token_endpoint,
      userInfoURL: client.issuer.userinfo_endpoint,
      clientID: client.client_id,
      clientSecret: client.client_secret,
      callbackURL: 'https://www.keycloak.org/app/#url=https://keycloak.mr-elamin.com&realm=test-realm&client=myclient',
      scope: 'openid email profile',
    },
    (issuer, sub, profile, accessToken, refreshToken, done) => {
      return done(null, profile);
    }
  );

  fastifyPassport.use(strategy);
  fastifyPassport.registerUserSerializer(async (user, request) => user);
  fastifyPassport.registerUserDeserializer(async (user, request) => user);

  fastify.get('/login', fastifyPassport.authenticate('openidconnect'));

  fastify.get('/callback', fastifyPassport.authenticate('openidconnect', {
    successRedirect: '/protected',
    failureRedirect: '/login',
  }));

  fastify.get('/logout', async (request, reply) => {
    request.logout();
    reply.redirect('/');
  });

  fastify.get('/protected', {
    preValidation: fastifyPassport.authenticate('session', { failureRedirect: '/login' })
  }, async (request, reply) => {
    reply.send(`Welcome ${request.user?.email || request.user?.sub}`);
  });

  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, opts)
  });

  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: Object.assign({}, opts)
  });
}