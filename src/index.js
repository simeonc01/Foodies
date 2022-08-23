import {render} from "react-dom";
import {BrowserRouter} from "react-router-dom";
import App from "./App";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./app.scss"

const rootElement = document.getElementById("root");
render(
    <BrowserRouter>
        <App/>
    </BrowserRouter>, rootElement);