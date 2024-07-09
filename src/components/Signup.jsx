import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function SignUp({ onSignUp }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [uuid, setUuid] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const userIdentifier = Cookies.get("csrftoken");
    if (userIdentifier) {
      setUuid(userIdentifier);
    }
  }, []);

  // const handleSignUp = async (e) => {
  //   e.preventDefault();

  //   const signUpData = {
  //     username,
  //     password,
  //     email,
  //     phone,
  //     first_name: firstName,
  //     last_name: lastName,
  //   };

  //   if (uuid) {
  //     signUpData.uuid = uuid;
  //   }

  //   try {
  //     const response = await fetch("http://31.129.99.177:8000/auth/register/", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(signUpData),
  //     });

  //     if (response.ok) {
  //       const data = await response.json();
  //       // Sign up muvaffaqiyatli bo'lsa, kerakli harakatlarni bajaring
  //       navigate("/login");
  //       onSignUp(username);
  //       console.log("Sign up successful:", data);
  //     } else {
  //       // Sign up muvaffaqiyatsiz bo'lsa, xatoni ko'rsating
  //       const errorData = await response.json();
  //       setError(errorData.message || "Регистрация прошла неудачно");
  //     }
  //   } catch (error) {
  //     setError("Ошибка сети");
  //   }
  // };

  const handleSignUp = async (e) => {
    e.preventDefault();

    const signUpData = {
      username,
      password,
      email,
      phone,
      first_name: firstName,
      last_name: lastName,
    };

    if (uuid) {
      signUpData.uuid = uuid;
    }

    try {
      const response = await api.post("/auth/register/", signUpData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        const data = response.data;
        // Sign up muvaffaqiyatli bo'lsa, kerakli harakatlarni bajaring
        navigate("/login");
        onSignUp(username);
        console.log("Sign up successful:", data);
      } else {
        // Sign up muvaffaqiyatsiz bo'lsa, login sahifasiga o'ting va xatoni ko'rsating
        navigate("/login");
        const errorData = response.data;
        setError(errorData.message || "Регистрация прошла неудачно");
      }
    } catch (error) {
      // Network yoki boshqa xato bo'lsa ham login sahifasiga o'ting va xatoni ko'rsating
      navigate("/login");
      if (error.response) {
        const errorData = error.response.data;
        setError(errorData.message || "Регистрация прошла неудачно");
      } else {
        setError("Ошибка сети");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Страница регистрации
        </h1>
        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Имя пользователя
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              maxLength="150"
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
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Адрес электронной почты
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength="254"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
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
              maxLength="15"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="first_name"
              className="block text-sm font-medium text-gray-700"
            >
              Имя
            </label>
            <input
              type="text"
              id="first_name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              maxLength="150"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="last_name"
              className="block text-sm font-medium text-gray-700"
            >
              Фамилия
            </label>
            <input
              type="text"
              id="last_name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              maxLength="150"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Зарегистрироваться
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
