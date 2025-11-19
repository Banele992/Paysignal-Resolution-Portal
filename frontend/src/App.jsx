import react from "react"
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import Admin from "./pages/Admin"
import NotFound from "./pages/NotFound"
import ProtectedRoute from "./components/ProtectedRoutes"


function Logout() {
  localStorage.clear()
  return <Navigate to="/login" />
}

//clear local storage when registering to remove old tokens from lingering and causing errors
function RegisterAndLogout() {
  localStorage.clear()
  return <Register/>
}

function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route
      path="/"
      element={
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      }
      />
      <Route
      path="/admin"
      element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <Admin />
        </ProtectedRoute>
      }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    </BrowserRouter>
  )
}

export default App
