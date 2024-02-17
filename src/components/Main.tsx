import { Route, Routes } from "react-router-dom";
import { Board } from "../pages/Board";
import { Contact } from "../pages/Contact";
import { Home } from "../pages/Home";
import { NewBoard } from "../pages/NewBoard";
import { SignIn } from "../pages/SignIn";

export const Main: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/boards/:boardId" element={<Board />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/NewBoard" element={<NewBoard />} />
      </Routes>
    </>
  );
};
