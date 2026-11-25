// Illustrazioni dei banner: forme piatte che leggono i token (accento, superfici, bordi), nessuna immagine da scaricare.
// Sono decorative: il titolo e i link del banner dicono già tutto.

export const CpuArt = ({ className }) => (
  <svg className={className} viewBox='0 0 360 280' aria-hidden='true' focusable='false'>
    <rect className='art-fill' x='80' y='30' width='200' height='200' rx='28' />
    <rect className='art-line' x='118' y='68' width='124' height='124' rx='14' />
    <rect className='art-dot' x='152' y='102' width='56' height='56' rx='8' />
    <path
      className='art-line'
      d='M120 30V8M160 30V8M200 30V8M240 30V8M120 252v-22M160 252v-22M200 252v-22M240 252v-22M80 70H58M80 110H58M80 150H58M80 190H58M280 70h22M280 110h22M280 150h22M280 190h22'
    />
  </svg>
);

// Case tower con pannello laterale in vetro: tre ventole, scheda video, alimentatore con le feritoie, tasto di accensione e piedini.
export const TowerArt = ({ className }) => (
  <svg className={className} viewBox='0 0 360 280' aria-hidden='true' focusable='false'>
    <rect className='art-fill' x='96' y='6' width='168' height='262' rx='16' />
    <circle className='art-dot' cx='240' cy='24' r='5' />
    <path className='art-line art-thin' d='M118 24h72' />
    <rect className='art-line' x='110' y='42' width='140' height='156' rx='8' />
    <g className='art-line'>
      <circle cx='140' cy='78' r='17' />
      <circle cx='140' cy='120' r='17' />
      <circle cx='140' cy='162' r='17' />
    </g>
    <g className='art-dot'>
      <circle cx='140' cy='78' r='4' />
      <circle cx='140' cy='120' r='4' />
      <circle cx='140' cy='162' r='4' />
      <rect x='176' y='118' width='62' height='18' rx='4' />
    </g>
    <path className='art-line art-thin' d='M176 80h62M176 160h62' />
    <rect className='art-soft' x='110' y='210' width='140' height='42' rx='6' />
    <path className='art-line art-thin' d='M126 222h108M126 232h108M126 242h108' />
    <rect className='art-fill' x='112' y='268' width='28' height='8' rx='3' />
    <rect className='art-fill' x='220' y='268' width='28' height='8' rx='3' />
  </svg>
);

export const KeyboardArt = ({ className }) => (
  <svg className={className} viewBox='0 0 360 280' aria-hidden='true' focusable='false'>
    <g className='art-fill'>
      <rect x='30' y='50' width='56' height='56' rx='10' />
      <rect x='98' y='50' width='56' height='56' rx='10' />
      <rect x='166' y='50' width='56' height='56' rx='10' />
      <rect x='234' y='50' width='56' height='56' rx='10' />
      <rect x='30' y='118' width='56' height='56' rx='10' />
      <rect x='98' y='118' width='56' height='56' rx='10' />
      <rect x='234' y='118' width='56' height='56' rx='10' />
      <rect x='98' y='186' width='192' height='48' rx='10' />
    </g>
    <rect className='art-dot' x='166' y='118' width='56' height='56' rx='10' />
  </svg>
);
