// JWT con gli stessi claim che emette il BE (ASP.NET Identity). La firma non viene verificata dal FE.
const ROLE = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
const EMAIL = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress';
const BIRTH = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/dateofbirth';
const ID = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier';

const base64Url = (obj) =>
  btoa(JSON.stringify(obj)).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');

export const makeToken = ({
  email = 'mario@test.local',
  role = 'Customer',
  birthDate = '1990-01-01',
  userId = 'user-1',
  expiresInSeconds = 3600,
} = {}) =>
  [
    base64Url({ alg: 'HS256', typ: 'JWT' }),
    base64Url({
      [ID]: userId,
      [EMAIL]: email,
      [ROLE]: role,
      [BIRTH]: birthDate,
      exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
    }),
    'signature',
  ].join('.');
