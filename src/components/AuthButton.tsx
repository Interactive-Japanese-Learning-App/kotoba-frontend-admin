type Props = {
  text: string;
  onClick?: () => void;
};

function AuthButton({ text, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="
        h-[46px]
        w-full
        rounded-xl
        bg-[#264d6d]
        text-white
        font-semibold
        text-[14px]
        hover:bg-[#1d3d57]
        transition
      "
    >
      {text}
    </button>
  );
}

export default AuthButton;