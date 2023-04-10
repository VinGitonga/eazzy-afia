import { createBrowserRouter } from "react-router-dom";
import Dashboard from "@/pages/dashboard";
import Testing from "@/layouts/testing";
import Home from "@/pages/home";
import Feedback from "./pages/feedback";
const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/",
        element: <Testing />,
        children: [
            {
                path: "dashboard",
                element: <Dashboard />,
            },
            {
                path: "feedback",
                element: <Feedback />,
            }
        ],
    }
         
]);
export default router;
    
        