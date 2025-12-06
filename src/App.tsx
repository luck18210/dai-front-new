import { BrowserRouter, HashRouter, Route, Routes } from "react-router-dom";
import LoadingSpinner from "./components/loadingSpinner";
import NotFoundRedirect from "./pages/notfound";
import DesktopNavBar from "./components/shared/desktop_nav";
import Home from "./pages/home";
import "./index.css";
import { styled } from "@mui/material";

const App = () => {
  const Wrapper = styled("div")(({ theme }) => ({
    maxWidth: 400,
    padding: "0",
    margin: "0 auto",
    [theme.breakpoints.down("sm")]: {
      maxWidth: "100%",
    },
  }));
  return (
    <BrowserRouter>
      <LoadingSpinner />
      <Wrapper>
        <DesktopNavBar />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Wrapper>
    </BrowserRouter>
  );
};

export default App;
