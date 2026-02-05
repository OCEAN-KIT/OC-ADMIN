import type { AreaItem } from "./constants";
import AreaCard from "./AreaCard";

type Props = {
  areas: AreaItem[];
};

export default function AreaList({ areas }: Props) {
  return (
    <div className="grid gap-4">
      {areas.length === 0 ? (
        <div className="p-10 bg-gray-50 text-center">
          <p className="text-sm text-gray-700 font-medium">
            조건에 맞는 작업영역이 없습니다.
          </p>
          <p className="text-xs text-gray-500 mt-1">
            검색어나 필터를 변경해 보세요.
          </p>
        </div>
      ) : (
        areas.map((area) => <AreaCard key={area.id} area={area} />)
      )}
    </div>
  );
}
