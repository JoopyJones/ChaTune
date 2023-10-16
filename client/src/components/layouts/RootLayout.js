import { Outlet } from "react-router-dom";

export default function RootLayout(){
    return(
        <div className="root-header">
            <div className="root-routes-header">
                <Outlet/>
            </div>
        </div>
    )
}