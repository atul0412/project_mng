import logo from '../components/assets/logo.png';

export default function Header() {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className='container'>
                <a className="navbar-brand" href="#">
                    <div className='d-flex'>
                        <img src={logo} alt="Logo" className='' mr-2 />
                        <div>Project mng </div>
                    </div>
                </a>
            </div>
        </nav>
    );
}