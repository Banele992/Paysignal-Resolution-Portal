//wrapper for protected route
import {Navigate} from "react-router-dom"
import {jwtDecode} from "jwt-decode"
import api from "../api"
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants"
import {useState, useEffect} from "react"


//frontend protection
function ProtectedRoute({ children, allowedRoles = []}) {
    const [status, setStatus] = useState("pending")

    useEffect(() => {
        auth().catch(() => setStatus("unauthorized"))
    }, [])

    const requiresSpecificRole = Array.isArray(allowedRoles) && allowedRoles.length > 0

    const applyRoleCheck = (decodedToken) => {
        const role = decodedToken.role || "user"
        if (requiresSpecificRole && !allowedRoles.includes(role)) {
            setStatus("forbidden")
            return false
        }
        setStatus("allowed")
        return true
    }

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        try{
            const res = await api.post("/api/token/refresh/", {
                refresh: refreshToken,
            });
            if (res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                const decoded = jwtDecode(res.data.access)
                return applyRoleCheck(decoded)
            } else {
                setStatus("unauthorized")
            }

        } catch (error) {
            console.log(error);
            setStatus("unauthorized");
        }
        return false
    };

    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN)
        if (!token) {
            setStatus("unauthorized")
            return
        }
        const decoded = jwtDecode(token)
        const tokenExpiration = decoded.exp
        const now = Date.now() / 1000

        if (tokenExpiration < now) {
            await refreshToken()
        } else {
            applyRoleCheck(decoded)
        }
    }

    if (status === "pending"){
        return <div>Loading...</div>
    }

    if (status === "allowed") {
        return children
    }

    if (status === "forbidden") {
        return <Navigate to ="/" replace />
    }

    return <Navigate to ="/login" replace />
}

export default ProtectedRoute