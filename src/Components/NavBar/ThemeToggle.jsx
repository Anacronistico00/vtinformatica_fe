import { Dropdown } from 'react-bootstrap';
import { BsCircleHalf, BsMoon, BsSun } from 'react-icons/bs';
import useThemePreference from '../../Utils/useThemePreference';

const OPTIONS = [
  { value: 'auto', label: 'Auto', Icon: BsCircleHalf },
  { value: 'light', label: 'Chiaro', Icon: BsSun },
  { value: 'dark', label: 'Scuro', Icon: BsMoon },
];

const ThemeToggle = () => {
  const [preference, choose] = useThemePreference();
  const current = OPTIONS.find((option) => option.value === preference) ?? OPTIONS[0];

  return (
    <Dropdown align='end' className='theme-toggle'>
      <Dropdown.Toggle variant='link' className='theme-toggle-button' aria-label={`Tema: ${current.label}`}>
        <current.Icon aria-hidden='true' />
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {OPTIONS.map(({ value, label, Icon }) => (
          <Dropdown.Item
            key={value}
            as='button'
            active={value === preference}
            aria-current={value === preference ? 'true' : undefined}
            onClick={() => choose(value)}
          >
            <Icon aria-hidden='true' className='me-2' />
            {label}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ThemeToggle;
