const { expressjwt: expressJwt } = require('express-jwt');

function authorize() {
  const secret = process.env.JWT_SECRET;
  const api = process.env.API_URL;
  return expressJwt({
    secret,
    algorithms: ['HS256'],
  }).unless({
    path: [
      `${api}/auth/login`,
      `${api}/auth/register`,
      { url: /\/api\/v1\/products(.*)/, methods: ['GET', 'OPTIONS'] },
      { url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS'] },
    ],
  });
}

module.exports = authorize;
