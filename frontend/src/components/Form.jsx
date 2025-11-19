import {useState} from "react"
import api from "../api"
import { Link, useNavigate } from "react-router-dom"
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants"
import "../styles/Form.css"

function Form({route, method}) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [role, setRole] = useState("user")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const name = method === "login" ? "Login" : "Register"

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        try {
            const payload = method === "register"
                ? {username, password, role}
                : {username, password}

            const res = await api.post(route, payload)
            if (method === "login"){
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh)

                if (res.data.role === "admin") {
                    navigate("/admin")
                } else {
                    navigate("/")
                }
            } else{
                navigate("/login")
            }

        }catch (error) {
            alert(error)
        } finally {
            setLoading(false)
        }
    };

    return <form onSubmit ={handleSubmit} className="form-container">
    <h1>{name}</h1>

    <input type="text" 
    className="form-input"
    value={username}
    onChange={(e) => setUsername(e.target.value)}
    placeholder="Username"
    />

     <input type="password" 
    className="form-input"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    placeholder="Password"
    />

    {method === "register" && (
        <div className="form-radio-group">
            <label>
                <input
                    type="radio"
                    name="role"
                    value="user"
                    checked={role === "user"}
                    onChange={() => setRole("user")}
                />
                User
            </label>
            <label>
                <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={role === "admin"}
                    onChange={() => setRole("admin")}
                />
                Admin
            </label>
        </div>
    )}

    <button className="form-button" type="submit">{name}</button>

    {method === "login" && (
        <p style={{ marginTop: "12px", fontSize: "14px" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "#007bff", textDecoration: "none" }}>
                Register
            </Link>
        </p>
    )}
    </form>

}

export default Form