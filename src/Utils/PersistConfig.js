import { createTransform } from 'redux-persist';

const EXPIRATION_TIME = 60 * 60 * 1000;

const expireTransform = createTransform(
  (inboundState) => {
    return {
      ...inboundState,
      _persistedAt: Date.now(),
    };
  },
  (outboundState) => {
    const now = Date.now();
    if (
      outboundState._persistedAt &&
      now - outboundState._persistedAt > EXPIRATION_TIME
    ) {
      console.log('Persist scaduto, reset store');
      localStorage.clear();
      return undefined;
    }
    return outboundState;
  }
);

export default expireTransform;
