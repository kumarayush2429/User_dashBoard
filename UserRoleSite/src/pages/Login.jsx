import { memo, useCallback, useContext, useState } from "react";
import { GlobalContext } from "../GlobalContext/GlobalContext";
import { Link, useNavigate } from "react-router-dom";
import { dashboard, register } from "../Routes/Routes";
import { apiLoginGet } from "../api/api";

const Login = () => {
  const [userInfo, SetUserInfo] = useState({ email: "", password: "" })
  const { roleName, setUser } = useContext(GlobalContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);






  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (roleName.trim() === "") return alert("Please Select Role");

    if (userInfo.email === "" || userInfo.password === "") {
      alert("Please fill all fields");
      return;
    }

    try {
      const roleKey = roleName.toLowerCase();
      const data = await apiLoginGet(`${roleKey}?email=${userInfo.email}&password=${userInfo.password}`);


      if (roleKey === "superadmin") {
        if (data.length > 0) {
          alert("Login Successfully..!!!");
          setUser(data[0]);
          navigate(dashboard);
        } else {
          alert(`Credentials are Not there in ${roleName}..!!!`);
        }
      } else {
        if (data.length > 0 && data[0].isdisable === 0) {
          alert("Login Successfully..!!!");
          setUser(data[0]);
          navigate(dashboard);
        } else if (data.length > 0 && data[0].isdisable === 1) {
          alert("User account is disabled");
        } else {
          alert(`Credentials are Not there in ${roleName}..!!!`);
        }
      }

    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong. Please try again.");
    }

    SetUserInfo({ email: "", password: "" });
  };


  const handleToggle = useCallback(() => {
    setShowPassword(prev => !prev);
  })








  return (
    <div className="container-fluid">
      <div className="row min-vh-100">
        <div className="col-md-6 p-0">
          <img
            src="/assests/images/LoginBackgroundImage.jpg"
            alt="Login Background"
            className="img-fluid w-100 h-100 object-fit-cover"
            style={{ objectFit: "cover" }}
          />
        </div>

        <div className="col-md-6 d-flex justify-content-center align-items-center">
          <form className="form w-75" onSubmit={handleLoginSubmit}>
            <h6 className="mb-4"> {roleName.trim() === "" ? "Please Select Role" : `Login As : ${roleName}`}</h6>
            <p className="form-title">Sign in to your account</p>

            <div className="input-container">
              <input value={userInfo.email} onChange={(e) => SetUserInfo({ ...userInfo, email: e.target.value })} name="email" placeholder="Enter email" type="email" autoComplete="on" />
              <span>
                <i className="bi bi-envelope-at"></i>
              </span>
            </div>

            <div className="input-container">
              <input value={userInfo.password} onChange={(e) => SetUserInfo({ ...userInfo, password: e.target.value })} name="password" placeholder="Enter password" type={showPassword ? 'text' : `password`} autoComplete="on" />

              <span className="cursor-pointer" onClick={handleToggle}>
                <i className="bi bi-lock"></i>
              </span>
            </div>
            <button className="submit" type="submit">
              Sign in
            </button>

            <div>
              <p className="signup">Don't have an account?
                <Link rel="noopener noreferrer" to={register} className="ms-1">Sign up</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default memo(Login);
