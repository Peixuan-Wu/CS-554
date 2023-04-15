import Link from 'next/link';

const linkStyle = {
  marginRight: 15
};

const Header = () => (
  <div>
    <Link style={linkStyle} href='/'>
      Home
    </Link>

    <Link style={linkStyle} href='/shows'>
      Shows
    </Link>
  </div>
);

export default Header;
