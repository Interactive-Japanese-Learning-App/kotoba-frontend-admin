import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

function AuthCard({ children }: Props) {
  return (
    <div
      className="
        bg-white
        w-full
        max-w-[390px]
        rounded-[18px]
        px-7
        py-7
        shadow-sm
      "
    >
      {children}
    </div>
  );
}

export default AuthCard;