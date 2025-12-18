import { useEffect } from "react";
import { useNavigate } from "react-router-dom"

const GoogleSuccess = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        console.log('GoogleSuccess token:', token);
        if (token) {
            localStorage.setItem("token", token)
            localStorage.setItem("authToken", token);
            window.location.href = "/candidate";
        }
        else {
            navigate("/login")
        }
    }, []);
    return <p>Logging in with Google...</p>
};
export default GoogleSuccess