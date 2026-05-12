type Props = {
  type: string;
  placeholder: string;
};

function AuthInput({ type, placeholder }: Props) {
  return (
    <input
      className="auth-input"
      type={type}
      placeholder={placeholder}
    />
  );
}

export default AuthInput;