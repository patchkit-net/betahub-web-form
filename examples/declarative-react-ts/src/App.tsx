import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { WebForm } from "./WebForm";

import "betahub-web-form/dist/bhwf.min.css";
import "betahub-web-form/dist/dropzone.min.css";

function App() {
  return (
    <>
      <WebForm projectId="asd" />
      <ToastContainer theme="dark" />
    </>
  );
}

export default App;
