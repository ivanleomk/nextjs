
import type { NextApiRequest, NextApiResponse } from 'next'
import { handleAuth, handleCallback, handleLogin, handleLogout } from '@auth0/nextjs-auth0';

const audience = process.env.HASURA_ENDPOINT;
const scope = "openid profile email";

function getUrls(req: NextApiRequest) {
  const host = req.headers['host'];
  const protocol = process.env.VERCEL_URL ? 'https' : 'http';
  const redirectUri = `${protocol}://${host}/api/auth/callback`;
  const returnTo = `${protocol}://${host}`;
  return {
    redirectUri,
    returnTo
  };
}

export default handleAuth({
  async callback(req: NextApiRequest, res: NextApiResponse) {
    try {
      const { redirectUri } = getUrls(req);
      await handleCallback(req, res, { redirectUri: redirectUri });
    } catch (error) {
      res.status(error.status || 500).end(error.message);
    }
  },

  async login(req: NextApiRequest, res: NextApiResponse) {
    try {
      const { redirectUri, returnTo } = getUrls(req);

      await handleLogin(req, res, {
        authorizationParams: {
          audience: audience,
          scope: scope,
          redirect_uri: redirectUri
        },
        returnTo: returnTo
      });
    } catch (error) {
      res.status(error.status || 400).end(error.message);
    }
  },

  async logout(req: NextApiRequest, res: NextApiResponse) {
    const { returnTo } = getUrls(req);
    await handleLogout(req, res, {
      returnTo: returnTo
    });
  }
});
