import Access from "./pages/access";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ToDo from "./pages/todo";
import ProtectedRoutes from "./utils/ProtectedRoutes";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Access />} />
        <Route
          path="/todo"
          element={
            <ProtectedRoutes>
              <ToDo />
            </ProtectedRoutes>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}


export default App;
