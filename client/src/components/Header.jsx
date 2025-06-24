import logo from '../assets/logo.png';

export default function Header() {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className='container'>
                <a className="navbar-brand" href="/">
                    <div className='d-flex align-items-center'>
                        <img src={logo} alt="Logo" className="me-2" style={{ height: '40px' }} />
                        <span>Project mng</span>
                    </div>
                </a>
                <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                        <a className="nav-link" aria-current="page" href="/Login"><b>Login</b></a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/signup"><b>Signup</b></a>
                    </li>
                </ul>
            </div>
        </nav>
    );
}