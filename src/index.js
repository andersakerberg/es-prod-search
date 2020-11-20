import React from "react";
import { render } from "react-snapshot";
import App from "./App";
import "@elastic/react-search-ui-views/lib/styles/styles.css";
import "./styles.css";

render(<App />, document.getElementById("root"));
