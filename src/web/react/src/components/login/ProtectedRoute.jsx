import { Navigate, Route, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ path, exact, children }) => {
  const auth = useSelector((store) => store.loginState.authenticated);
  return auth ? (
    <Route path={path} exact={exact} >
      {children}
    </Route>
  ) : (
    <Navigate to='/login' />
  );
};

export const ProtectedElement = ({ children }) => {
  const auth = useSelector((store) => store.loginState.authenticated);
  return auth ? (
    <div >
      {children}
    </div>
  ) : (
    <Navigate to='/login' />
  );
};

export default ProtectedRoute;