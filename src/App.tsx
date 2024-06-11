import "./App.css";
import HomePage from "./components/HomePage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AddUser from "./components/AddUser";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<HomePage />} />
        <Route path="/addUser" element={<AddUser />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
