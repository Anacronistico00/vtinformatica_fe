import { createTransform } from 'redux-persist';
import autoMergeLevel1 from 'redux-persist/lib/stateReconciler/autoMergeLevel1';
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

// Uno slice scartato dal transform (undefined) non va scritto sopra lo stato iniziale:
// autoMergeLevel1 lo copierebbe e state.auth / state.cart diventerebbero undefined (crash all'avvio).
const withoutDroppedSlices = (inboundState) =>
  inboundState &&
  Object.fromEntries(Object.entries(inboundState).filter(([, value]) => value !== undefined));

export const makePersistConfig = (storage) => ({
  key: 'root',
  storage,
  transforms: [expireTransform],
  stateReconciler: (inboundState, originalState, reducedState, config) =>
    autoMergeLevel1(withoutDroppedSlices(inboundState), originalState, reducedState, config),
});

export default expireTransform;
