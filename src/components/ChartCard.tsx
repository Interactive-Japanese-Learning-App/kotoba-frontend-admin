import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
} from "recharts";

const data = [
  { day: "Sen", value: 40 },
  { day: "Sel", value: 80 },
  { day: "Rab", value: 55 },
  { day: "Kam", value: 100 },
  { day: "Jum", value: 75 },
];

type Props = {
  title: string;
};

function ChartCard({ title }: Props) {
  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm">

      <h2 className="font-semibold text-2xl">
        {title}
      </h2>

      <div className="h-[340px] mt-6">

        <ResponsiveContainer width="100%" height="100%">

          <BarChart data={data}>

            <XAxis dataKey="day" />

            <Tooltip />

            <Bar
              dataKey="value"
              fill="#123b5d"
              radius={[10, 10, 0, 0]}
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}

export default ChartCard;