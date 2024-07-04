import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import "semantic-ui-css/semantic.min.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ErrorPage from "./pages/errorPage";
import ConverterPage from "./pages/converterPage";
import SettingsPage from "./pages/settings";
import HelpPage from "./pages/helpPage";
import AboutPage from "./pages/aboutPage";
import ExamplesPage from "./pages/examplesPage";
import Layout from "./pages/layout";

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);

const router = createBrowserRouter([
    {
        path: "umap-to-uefn-converter/",
        element: <Layout />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "umap-to-uefn-converter/",
                element: <ConverterPage />,
            },
            {
                path: "umap-to-uefn-converter/settings",
                element: <SettingsPage />,
            },
            {
                path: "umap-to-uefn-converter/help",
                element: <HelpPage />,
            },
            {
                path: "umap-to-uefn-converter/imprint",
                element: <AboutPage />,
            },
            {
                path: "umap-to-uefn-converter/examples",
                element: <ExamplesPage />,
            },
        ],
    },
]);

root.render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
