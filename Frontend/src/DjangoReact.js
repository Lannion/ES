// Sample View
import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [data, setData] = useState("");

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/example")
      .then(response => setData(response.data.message))
      .catch(error => console.error(error));
  }, []);

  return <div>{data}</div>;
}

export default App;
