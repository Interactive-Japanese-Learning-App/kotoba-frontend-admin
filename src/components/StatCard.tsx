import type { ReactNode } from "react";

type Props = {
  title: string;
  value: string;
  subtitle?: string;
  icon: ReactNode;
  iconBg: string;
  iconColor: string;
};

function StatCard({ title, value, subtitle, icon, iconBg, iconColor }: Props) {
  return (
    <div className="stats-card">

      <div>
        <p className="text-[12px] text-gray-400">{title}</p>

        <h2
          className="text-[22px] font-bold mt-1"
          style={{ color: iconColor }}
        >
          {value}
        </h2>

        {subtitle && (
          <p className="text-[12px] text-gray-400 mt-1">
            {subtitle}
          </p>
        )}
      </div>

      <div
        className="icon-box"
        style={{ background: iconBg, color: iconColor }}
      >
        {icon}
      </div>

    </div>
  );
}

export default StatCard;