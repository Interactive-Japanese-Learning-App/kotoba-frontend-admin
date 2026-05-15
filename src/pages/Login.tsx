import { Link, useNavigate } from "react-router-dom";

import logo from "../assets/kotoba-logo.png";

import AuthInput from "../components/AuthInput";
import AuthButton from "../components/AuthButton";
import AuthCard from "../components/AuthCard";

function Login() {

  const navigate = useNavigate();

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

      {/* Logo */}
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

      {/* Card */}
      <AuthCard>

        <div className="flex flex-col gap-4">

          <AuthInput
            type="email"
            placeholder="Email"
          />

          <AuthInput
            type="password"
            placeholder="Kata Sandi"
          />

          <div className="flex justify-end -mt-1">

            <a
              href="#"
              className="
                text-[13px]
                text-[#6f8aa5]
              "
            >
              Lupa password?
            </a>

          </div>

          <AuthButton
            text="Masuk"
            onClick={() => navigate("/dashboard")}
          />

        </div>

      </AuthCard>

      {/* Google */}
      <div className="mt-6">

        <img
          src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
          alt="Google"
          className="w-[36px]"
        />

      </div>

      {/* Bottom */}
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