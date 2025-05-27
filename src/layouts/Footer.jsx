import {Link} from "react-router-dom"

const Footer = () => {
  return (
    <>
        <footer
          className="text-center text-lg-start text-white"
          style={{"background-color": "#3e4551"}}
        >
          <div className="container p-4 pb-0">
            <section className="">
              <div className="row">
                <div className="col-lg-4 col-md-6 mb-4 mb-md-0">
                  <h5 className="text-uppercase">FOOTER CONTENT</h5>

                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Molestiae modi cum ipsam ad, illo possimus laborum ut
                    reiciendis obcaecati. Ducimus, quas. Corrupti, pariatur
                    eaque? Reiciendis assumenda iusto sapiente inventore animi?
                  </p>
                </div>
                <div className="col-lg-2 col-md-6 mb-4 mb-md-0">
                  <h5 className="text-uppercase">Links</h5>

                  <ul className="list-unstyled mb-0">
                    <li>
                      <Link to="/" className="text-white">
                        Link 1
                      </Link>
                    </li>
                    <li>
                      <Link to="/" className="text-white">
                        Link 2
                      </Link>
                    </li>
                    <li>
                      <Link to="/" className="text-white">
                        Link 3
                      </Link>
                    </li>
                    <li>
                      <Link to="/" className="text-white">
                        Link 4
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="col-lg-2 col-md-6 mb-4 mb-md-0">
                  <h5 className="text-uppercase">Links</h5>

                  <ul className="list-unstyled mb-0">
                    <li>
                      <Link to="/" className="text-white">
                        Link 1
                      </Link>
                    </li>
                    <li>
                      <Link to="/" className="text-white">
                        Link 2
                      </Link>
                    </li>
                    <li>
                      <Link to="/" className="text-white">
                        Link 3
                      </Link>
                    </li>
                    <li>
                      <Link to="/" className="text-white">
                        Link 4
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="col-lg-2 col-md-6 mb-4 mb-md-0">
                  <h5 className="text-uppercase">Links</h5>

                  <ul className="list-unstyled mb-0">
                    <li>
                      <Link to="/" className="text-white">
                        Link 1
                      </Link>
                    </li>
                    <li>
                      <Link to="/" className="text-white">
                        Link 2
                      </Link>
                    </li>
                    <li>
                      <Link to="/" className="text-white">
                        Link 3
                      </Link>
                    </li>
                    <li>
                      <Link to="/" className="text-white">
                        Link 4
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="col-lg-2 col-md-6 mb-4 mb-md-0">
                  <h5 className="text-uppercase">Links</h5>

                  <ul className="list-unstyled mb-0">
                    <li>
                      <Link to="/" className="text-white">
                        Link 1
                      </Link>
                    </li>
                    <li>
                      <Link to="/" className="text-white">
                        Link 2
                      </Link>
                    </li>
                    <li>
                      <Link to="/" className="text-white">
                        Link 3
                      </Link>
                    </li>
                    <li>
                      <Link to="/" className="text-white">
                        Link 4
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <hr className="mb-4" />
            <section className="">
              <p className="d-flex justify-content-center align-items-center">
                <span className="me-3">Register for free</span>
                <button type="button" className="btn btn-outline-light btn-rounded">
                  Sign up!
                </button>
              </p>
            </section>

            <hr className="mb-4" />
          </div>
          <div
            className="text-center p-3"
            style={{"background-color": "rgba(0, 0, 0, 0.2)"}}
          >
            © 2025 Copyright:
            <Link className="text-white" to="https://anoy369.com/">
              anoy369.com
            </Link>
          </div>
        </footer>
    </>
  );
};

export default Footer;
