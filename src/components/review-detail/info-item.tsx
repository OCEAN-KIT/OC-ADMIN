"use client";

export default function InfoItem({
  icon,
  item,
  value,
}: {
  icon: React.ReactNode;
  item: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2 text-sm text-gray-700 ring-1 ring-gray-200">
      {icon}
      <span className="font-medium">{item}</span>
      <span className="ml-auto">{value}</span>
    </div>
  );
}
