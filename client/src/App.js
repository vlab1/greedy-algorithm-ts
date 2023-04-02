import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { useRoutes } from "./routes";

const App = () => {
  const routes = useRoutes();
  return (
    <>
      <BrowserRouter>
        {routes}
      </BrowserRouter>
    </>
  );
};

export default App;
