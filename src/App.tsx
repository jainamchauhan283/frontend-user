import "./App.css";
import HomePage from "./components/HomePage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AddUser from "./components/AddUser";
import UpdateUser from "./components/UpdateUser";
import LoginPage from "./components/LoginPage";
import TaskPage from "./components/TaskPage";
import Main from "./components/Main";
import { Provider} from "react-redux";
import { store } from "./redux/store";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route index path="/home" element={<HomePage />} />
        <Route path="/register" element={<AddUser />} />
        <Route path="/updateUser" element={<UpdateUser />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/task" element={<TaskPage />} />
        <Route path="/" element={<Main />} />
      </Routes>
    </BrowserRouter>
    <Toaster position="top-right" />
    </Provider>
  );
}

export default App;
