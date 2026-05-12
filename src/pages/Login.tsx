import { Link } from "react-router-dom";
import logo from "../assets/kotoba-logo.png";

function Login() {
  return (
    <div className="min-h-screen bg-[#f3f3f5] flex flex-col items-center justify-center">

      {/* Logo */}
      <div className="flex flex-col items-center mb-10">

        <img
        src={logo}
        alt="KOTOBA Logo"
        className="w-[130px]"
        />

        <h1 className="text-[#123b5d] text-[28px] font-bold mt-2 tracking-wide">
          KOTOBA
        </h1>

      </div>

      {/* Card */}
      <div className="bg-[#f7f7f9] w-[490px] rounded-[10px] px-16 py-14 shadow-sm">

        <div className="flex flex-col gap-5">

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
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

          {/* Password */}
          <input
            type="password"
            placeholder="Kata Sandi"
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

          {/* Forgot */}
          <div className="flex justify-end -mt-2">

            <a
              href="#"
              className="text-[14px] text-[#6f8aa5]"
            >
              Lupa password?
            </a>

          </div>

          {/* Button */}
          <button
            className="
              h-[52px]
              rounded-[8px]
              bg-[#264d6d]
              text-white
              font-bold
              text-[16px]
              mt-1
            "
          >
            Masuk
          </button>

        </div>

      </div>

      {/* Google */}
      <div className="mt-12">

        <img
          src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
          width="42"
        />

      </div>

      {/* Bottom Text */}
      <p className="mt-10 text-[#666] text-[15px]">

        Belum punya akun?

        <Link
          to="/register"
          className="text-[#b31e23] font-semibold ml-1"
        >
          Daftar
        </Link>

      </p>

    </div>
  );
}

export default Login;