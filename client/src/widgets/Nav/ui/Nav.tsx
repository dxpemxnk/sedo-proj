// import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { UserContext } from "../Context/UserContext";
// import { axiosInstance, setAccessToken } from "../../../shared/lib/axiosInstance";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/rtkUser";
import { logout } from "@/entities/user/model/userThunk";
import { CLIENT_ROUTES } from "@/app/Router";

export function Nav(): JSX.Element {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);

  const handlerLogout = () => {
    dispatch(logout());
    navigate(CLIENT_ROUTES.AUTH);
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          ALFA SEDO{" "}
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link active" to={"/docs"}>
                Create doc
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link active" to={"/list"}>
                See doc
              </Link>
            </li>
            {!user && (
              <>
                {" "}
                <li className="nav-item">
                  <Link className="nav-link active" to={"/auth"}>
                    Auth
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link active" to={"/reg"}>
                    Reg
                  </Link>
                </li>
              </>
            )}

            {user && (
              <>
                <li className="nav-item">{user.email}</li>
                <button onClick={handlerLogout}>Выйти </button>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
