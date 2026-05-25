type Props = {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
};

function StatCard({
  title,
  value,
  subtitle,
  icon,
  iconBg,
  iconColor,
}: Props) {
  return (
    <div className="stats-card">

      <div>

        <p className="text-muted">
          {title}
        </p>

        <h2
          className="
            text-[24px]
            font-bold
            text-[#264d6d]
            mt-1
          "
        >
          {value}
        </h2>

        <p className="text-muted mt-1">
          {subtitle}
        </p>

      </div>

      <div
        className="icon-box"
        style={{
          backgroundColor: iconBg,
          color: iconColor,
        }}
      >
        {icon}
      </div>

    </div>
  );
}

export default StatCard;