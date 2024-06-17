import "./App.css";
import HomePage from "./components/HomePage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AddUser from "./components/AddUser";
import UpdateUser from "./components/UpdateUser";
import LoginPage from "./components/LoginPage";
import TaskPage from "./components/TaskPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<HomePage />} />
        <Route path="/addUser" element={<AddUser />} />
        <Route path="/updateUser" element={<UpdateUser />} />
        <Route path="/loginPage" element={<LoginPage />} />
        <Route path="/taskpage" element={<TaskPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
