// Ex. Libraries
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Main = () => {
  const accessToken = useSelector((state: any) => state.form.accessToken);
  // debugger
  if (accessToken) {
    return <Navigate to="/task" replace />;
  } else {
    return <Navigate to="/login" replace />;
  }
};

export default Main;
