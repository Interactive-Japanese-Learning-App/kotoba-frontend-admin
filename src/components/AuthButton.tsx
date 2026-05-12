type Props = {
  text: string;
};

function AuthButton({ text }: Props) {
  return (
    <button className="auth-button">
      {text}
    </button>
  );
}

export default AuthButton;