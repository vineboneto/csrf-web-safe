import { useNavigate } from "react-router-dom";

export default function Page() {
  const navigate = useNavigate();
  return (
    <>
      <p>Protected</p>
      <button onClick={() => navigate("/login")}>Go Login</button>
    </>
  );
}
