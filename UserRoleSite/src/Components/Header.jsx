import { memo, useContext } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { GlobalContext } from "../GlobalContext/GlobalContext"

const Header = () => {
  const { SetRoleName, logout, user } = useContext(GlobalContext)
  const roles = ['Superadmin', 'Admin', 'Employee']
  const location = useLocation();
  const navigate = useNavigate();

  const IsLogin = location.pathname === "/";
  const IsRegister = location.pathname === "/register"


  const handlerole = (rolename) => {
    SetRoleName(rolename)
  }

  const handlelogout = () => {
    logout()
    console.log("Logout Successfully..")
    alert("Logout Successfully..")
    navigate("/")
  }


  const Username = user?.username.toUpperCase();



  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary border-bottom">
      <div className="container-fluid">
        <Link className="navbar-brand" to={"/"}>Navbar</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          {IsLogin && <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Roles
              </a>
              <ul className="dropdown-menu">

                {roles.map((role, index) => (
                  <li key={`Roles + ${index}`}>
                    <span onClick={() => handlerole(role)} className="dropdown-item cursor-pointer">{role}</span>
                  </li>
                ))}
              </ul>
            </li>
          </ul>}

          {!IsRegister && !IsLogin &&

            <div className="mx-auto">
              <h4 className="mb-0">Welcome {Username}</h4>
            </div>}


          <div>
            {!IsRegister && <button onClick={handlelogout} className="btn btn-outline-primary">Logout</button>}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default memo(Header)
