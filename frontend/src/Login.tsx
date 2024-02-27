import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";

export default function Page() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "admin",
    password: "admin",
  });

  async function signIn() {
    try {
      const { data } = await api.post("/auth", form);
      if (!data) {
        return;
      }

      api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
      navigate("/");
    } catch (err) {
      alert("Unauthorized");
    }
  }

  const onChange =
    (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((old) => ({ ...old, [name]: e.target.value }));
    };

  return (
    <>
      <h3>Login</h3>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <input
          name="username"
          style={{ marginBottom: "1rem" }}
          onChange={onChange("username")}
          value={form.username}
        />
        <input
          type="password"
          name="password"
          style={{ marginBottom: "1rem" }}
          onChange={onChange("password")}
          value={form.password}
        />
      </div>

      <button onClick={signIn}>SignIn</button>
    </>
  );
}
