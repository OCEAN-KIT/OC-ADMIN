"use client";

type Diver = { diverId: string; name: string; role: string };

export default function DiverToggle({
  participants,
  activeDiverId,
  onChange,
}: {
  participants: Diver[];
  activeDiverId: string;
  onChange: (diverId: string) => void;
}) {
  return (
    <div className="mt-6 flex flex-wrap items-center gap-2">
      {participants.map((p) => {
        const active = p.diverId === activeDiverId;
        return (
          <button
            key={p.diverId}
            type="button"
            onClick={() => onChange(p.diverId)}
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm ring-1 transition
              ${
                active
                  ? "bg-[#34609E] text-white ring-transparent"
                  : "bg-white text-gray-700 ring-gray-200 hover:bg-gray-50"
              }`}
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black/5 text-xs font-semibold">
              {p.name.slice(0, 1)}
            </span>
            <span>{p.name}</span>
            <span className="text-xs opacity-70">({p.role})</span>
          </button>
        );
      })}
    </div>
  );
}
