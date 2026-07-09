import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import logo from "../assets/kotoba-logo.png";

import AuthButton from "../components/AuthButton";
import AuthCard from "../components/AuthCard";

import api from "../services/api";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);


  //
  // HANDLE LOGIN
  //
  const handleLogin = async () => {

    try {

      if (!email || !password) {
        console.log(
          "Email dan password wajib diisi"
        );
        return;
      }

      setLoading(true);


      const response = await api.post(
        "/auth/admin/login",
        {
          email,
          password,
        }
      );


      //
      // SAVE TOKEN
      //
      localStorage.setItem(
        "token",
        response.data.token
      );


      localStorage.setItem(
        "admin",
        JSON.stringify(
          response.data.admin
        )
      );


      //
      // LANGSUNG MASUK DASHBOARD
      //
      navigate("/dashboard");


    } catch (error: any) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  };


  return (
    <div
      className="
        min-h-screen
        bg-[#f3f3f5]
        flex
        flex-col
        items-center
        justify-center
        px-4
      "
    >


      {/* LOGO */}
      <div className="flex flex-col items-center mb-6">

        <img
          src={logo}
          alt="KOTOBA Logo"
          className="w-[90px]"
        />

        <h1
          className="
            text-[#123b5d]
            text-[24px]
            font-bold
            mt-1
            tracking-wide
          "
        >
          KOTOBA
        </h1>

      </div>



      {/* CARD */}
      <AuthCard>

        <div className="flex flex-col gap-4">


          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="
              h-[52px]
              rounded-[8px]
              border
              border-[#d2d2d2]
              bg-[#f7f7f9]
              px-5
              text-[16px]
              outline-none
              focus:border-[#264d6d]
            "
          />



          {/* PASSWORD */}
          <div className="relative">

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Kata Sandi"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="
                w-full
                h-[52px]
                rounded-[8px]
                border
                border-[#d2d2d2]
                bg-[#f7f7f9]
                px-5
                pr-12
                text-[16px]
                outline-none
                focus:border-[#264d6d]
              "
            />


            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
              className="
                absolute
                right-4
                top-1/2
                -translate-y-1/2
                text-[#6f8aa5]
              "
            >

              {showPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}

            </button>

          </div>




          {/* BUTTON */}
          <AuthButton
            text={
              loading
                ? "Loading..."
                : "Masuk"
            }
            onClick={handleLogin}
          />


        </div>

      </AuthCard>




      {/* BOTTOM */}
      <p className="mt-5 text-[#666] text-[14px]">

        Belum punya akun?


        <Link
          to="/register"
          className="
            text-[#b31e23]
            font-semibold
            ml-1
          "
        >
          Daftar
        </Link>


      </p>


    </div>
  );
}


export default Login;