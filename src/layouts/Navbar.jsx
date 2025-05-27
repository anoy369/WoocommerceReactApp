import {Link} from "react-router-dom"
const NavBar = () => {
    return <>
        <nav className="navbar navbar-expand-lg navbar-light">
            <Link className="navbar-brand" to="/">My Store</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
                <li className="nav-item">
                <Link to="/" className="nav-link">Home</Link>
                </li>
                <li className="nav-item">
                <Link to="/products" className="nav-link">Products</Link>
                </li>
                <li className="nav-item">
                <Link to="/cart" className="nav-link">
                    Cart
                    <span className="badge pill bg-secondary">0</span>
                </Link>
                </li>
                <li className="nav-item">
                <Link to="/my-account" className="nav-link">My Account</Link>
                </li>
                <li className="nav-item">
                <Link to="/my-orders" className="nav-link">My Orders</Link>
                </li>
                <li className="nav-item">
                <Link to="/" className="nav-link" >Logout</Link>
                </li>
                <li className="nav-item">
                <Link to="/login" className="nav-link">Login/Signup</Link>
                </li>
            </ul>
            </div>
        </nav>
  
    </>
}

export default NavBar