type Props = {
  type: string;
  placeholder: string;
};

function AuthInput({ type, placeholder }: Props) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className="
        h-[46px]
        w-full
        rounded-xl
        border
        border-[#d7d7d7]
        bg-white
        px-4
        text-[14px]
        outline-none
        focus:border-[#264d6d]
        transition
      "
    />
  );
}

export default AuthInput;