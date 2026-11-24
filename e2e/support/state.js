import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Id dei prodotti creati dal setup, letti dai test (file non versionato).
export const STATE_FILE = fileURLToPath(new URL('../.state.json', import.meta.url));

export const readState = () => JSON.parse(readFileSync(STATE_FILE, 'utf8'));
