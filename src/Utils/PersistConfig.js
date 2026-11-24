import { createTransform } from 'redux-persist';
import { isTokenExpired } from './jwtUtils';

const EXPIRATION_TIME = 60 * 60 * 1000;

// La sessione vale quanto il token: alla riapertura, un token scaduto (exp del JWT) non viene
// ripristinato. Gli altri slice (cache di catalogo, carrello) scadono dopo un'ora di inattività.
const expireTransform = createTransform(
  (inboundState) => {
    return {
      ...inboundState,
      _persistedAt: Date.now(),
    };
  },
  (outboundState, key) => {
    if (key === 'auth') {
      return outboundState.token && isTokenExpired(outboundState.token) ? undefined : outboundState;
    }

    const now = Date.now();
    if (
      outboundState._persistedAt &&
      now - outboundState._persistedAt > EXPIRATION_TIME
    ) {
      return undefined;
    }
    return outboundState;
  }
);

export default expireTransform;
