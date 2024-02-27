import { useNavigate } from "react-router-dom";
import api from "./api";
import { useState } from "react";
import { AxiosError } from "axios";

export default function Page() {
  const navigate = useNavigate();
  const [fetchData, setFetchData] = useState<Record<string, string> | null>(
    null
  );

  async function fetchDataProtected() {
    try {
      const { data } = await api.get("/protected");

      setFetchData(data);
    } catch (err) {
      if (err instanceof AxiosError) {
        setFetchData(err?.response?.data || { err: "Unknow Error" });
        return;
      }

      setFetchData({ err: "Unknow Error" });
    }
  }

  return (
    <>
      <p>Protected</p>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <button
          style={{ marginBottom: "1rem" }}
          onClick={() => navigate("/login")}
        >
          Go Login
        </button>
        <button style={{ marginBottom: "1rem" }} onClick={fetchDataProtected}>
          Request Data
        </button>
        {fetchData && <pre>{JSON.stringify(fetchData, null, 2)}</pre>}
      </div>
    </>
  );
}
