"use client";

export default function DetailField({
  label,
  value,
}: {
  label: string;
  value: string | number | number[] | undefined;
}) {
  const display = Array.isArray(value)
    ? `${value[0]}년 ${String(value[1]).padStart(2, "0")}월 ${String(value[2]).padStart(2, "0")}일 ${String(value[3]).padStart(2, "0")}시 ${String(value[4]).padStart(2, "0")}분`
    : (value ?? "-");

  return (
    <dl className="flex items-baseline justify-between gap-4 border-b border-gray-100 py-2">
      <dt className="shrink-0 text-sm text-gray-500">{label}</dt>
      <dd className="text-sm font-medium text-gray-900 text-right">
        {display}
      </dd>
    </dl>
  );
}
