import { useEffect, useState } from "react"
import { GlobalContext } from "./GlobalContext"

const GlobalProvider = ({ children }) => {
    const [roleName, SetRoleName] = useState(() => sessionStorage.getItem('personRole') || "")
    const [user, setUser] = useState(() => {
        const savedUser = sessionStorage.getItem("userData");
        return savedUser ? JSON.parse(savedUser) : undefined;
    });

    useEffect(() => {
        if (roleName) {
            sessionStorage.setItem('personRole', roleName);
        }
    }, [roleName])

    useEffect(() => {
        if (user) {
            sessionStorage.setItem("userData", JSON.stringify(user));
        }
    }, [user]);

    const logout = () => {
        sessionStorage.removeItem('personRole');
        sessionStorage.removeItem('userData');
        SetRoleName("");
        setUser(undefined);
    }



    return (
        <GlobalContext.Provider value={{ roleName, SetRoleName, user, setUser, logout }}>
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalProvider
