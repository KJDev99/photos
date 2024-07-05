import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

function Login({ onLogin }) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const userIdentifier = Cookies.get("user_identifier");
    console.log(userIdentifier);
    if (userIdentifier) {
      onLogin(userIdentifier);
    }
  }, [onLogin]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const uuid = JSON.parse(
        sessionStorage.getItem("image_upload_state")
      ).getId;

      const requestBody = {
        phone,
        password,
      };

      if (uuid) {
        requestBody.uuid = uuid;
      }

      console.log(requestBody);

      console.log(requestBody, "requestBody");
      console.log(
        JSON.parse(sessionStorage.getItem("image_upload_state")).getId,
        "getid"
      );

      const response = await fetch("http://192.168.0.164:8000/auth/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const data = await response.json();
        navigate("/");
        console.log("Login successful:", data);
        sessionStorage.setItem("succesToken", data.access);
        onLogin(data.access);
      } else {
        console.log(uuid);
        const errorData = await response.json();
        setError(errorData.message || "Login failed");
      }
    } catch (error) {
      setError("Network erroraa");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Страница авторизации</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Телефон
            </label>
            <input
              type="text"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              maxLength="15"
              minLength="1"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Пароль
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="1"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Авторизоваться
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          У вас нет аккаунта?
          <button
            onClick={() => navigate("/signup")}
            className="text-indigo-600 hover:text-indigo-500 font-medium"
          >
            Зарегистрироваться
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
