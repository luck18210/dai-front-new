import { BrowserRouter, HashRouter, Route, Routes } from "react-router-dom";
import LoadingSpinner from "./components/loadingSpinner";
import NotFoundRedirect from "./pages/notfound";
import DesktopNavBar from "./components/shared/desktop_nav";
import Home from "./pages/home";
import "./index.css";

const App = () => {
  return (
    <BrowserRouter>
      <LoadingSpinner />
      <DesktopNavBar />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
