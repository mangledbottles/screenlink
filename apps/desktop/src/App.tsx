import { HashRouter, Route, Routes } from "react-router-dom";
import { Webcam } from "./components/Webcam";

import { Landing } from "./Landing";
import { Floating } from "./components/Floating";

export const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/webcam" element={<Webcam />} />
        <Route path="/floating" element={<Floating />} />
      </Routes>
    </HashRouter>
  );
};
