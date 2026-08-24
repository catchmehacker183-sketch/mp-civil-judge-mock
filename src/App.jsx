import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MockTest from "./pages/MockTest";
import Result from "./pages/Result";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/mock" element={<MockTest />} />
      <Route path="/result" element={<Result />} />
    </Routes>
  );
}