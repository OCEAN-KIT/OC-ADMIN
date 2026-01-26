"use client";

import { useState } from "react";
import { Leaf } from "lucide-react";

// 이식 방식 enum
const transplantMethods = [
  {
    value: "SEEDLING_STRING",
    label: "종묘줄",
    unit: "줄",
    description: "종묘줄(줄)",
  },
  {
    value: "ROPE",
    label: "로프",
    unit: "m",
    description: "로프(m) : 종묘줄을 로프에 고정하여 이식",
  },
  {
    value: "ROCK_FIXATION",
    label: "암반 고정",
    unit: "지점",
    description: "종묘를 암반에 직접 부착하여 이식",
  },
  {
    value: "TRANSPLANT_MODULE",
    label: "이식 모듈",
    unit: "기",
    description: "이식 모듈(기) : 제작된 모듈에 부착 후 수중에 고정",
  },
  {
    value: "DIRECT_FIXATION",
    label: "직접 고정 지점",
    unit: "지점",
    description: "직접 고정 지점(지점)",
  },
];

// 착생 상태 enum
const attachmentStatuses = [
  {
    value: "GOOD",
    label: "양호",
    color: "border-emerald-500 bg-emerald-50 text-emerald-700",
    activeColor: "ring-emerald-500",
  },
  {
    value: "NORMAL",
    label: "보통",
    color: "border-yellow-500 bg-yellow-50 text-yellow-700",
    activeColor: "ring-yellow-500",
  },
  {
    value: "POOR",
    label: "미흡",
    color: "border-rose-500 bg-rose-50 text-rose-700",
    activeColor: "ring-rose-500",
  },
];

// 더미 종 데이터 (실제로는 API에서 가져옴)
const dummySpecies = [
  { id: 1, name: "감태", category: "MACROALGAE" },
  { id: 2, name: "모자반", category: "MACROALGAE" },
  { id: 3, name: "대황", category: "MACROALGAE" },
  { id: 4, name: "미역", category: "MACROALGAE" },
  { id: 5, name: "다시마", category: "MACROALGAE" },
];

export default function BasicInfoSection() {
  const [formData, setFormData] = useState({
    recordDate: "",
    method: "",
    speciesId: "",
    count: "",
    areaSize: "",
    attachmentStatus: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const selectedMethod = transplantMethods.find(
    (m) => m.value === formData.method,
  );

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2">
          <Leaf className="h-5 w-5 text-[#2C67BC]" />
          기본 식별 정보
        </h2>
      </div>
      <div className="p-6 space-y-5">
        {/* 기록 날짜 */}
        <div>
          <label
            htmlFor="recordDate"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            기록 날짜 <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              type="date"
              id="recordDate"
              name="recordDate"
              value={formData.recordDate}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2C67BC]/20 focus:border-[#2C67BC]"
            />
          </div>
        </div>

        {/* 이식 방식 */}
        <div>
          <label
            htmlFor="method"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            이식 방식 <span className="text-rose-500">*</span>
          </label>
          <select
            id="method"
            name="method"
            value={formData.method}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#2C67BC]/20 focus:border-[#2C67BC]"
          >
            <option value="">선택하세요</option>
            {transplantMethods.map((method) => (
              <option key={method.value} value={method.value}>
                {method.label} ({method.unit})
              </option>
            ))}
          </select>
          {selectedMethod && (
            <p className="mt-1.5 text-xs text-gray-500">
              {selectedMethod.description}
            </p>
          )}
        </div>

        {/* 종 선택 */}
        <div>
          <label
            htmlFor="speciesId"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            종 (Species) <span className="text-rose-500">*</span>
          </label>
          <select
            id="speciesId"
            name="speciesId"
            value={formData.speciesId}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#2C67BC]/20 focus:border-[#2C67BC]"
          >
            <option value="">종을 선택하세요</option>
            {dummySpecies.map((species) => (
              <option key={species.id} value={species.id}>
                {species.name}
              </option>
            ))}
          </select>
        </div>

        {/* 수량 및 면적 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* 수량 */}
          <div>
            <label
              htmlFor="count"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              수량 <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                id="count"
                name="count"
                value={formData.count}
                onChange={handleChange}
                placeholder="0"
                min="0"
                className="w-full px-4 py-2.5 pr-16 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2C67BC]/20 focus:border-[#2C67BC]"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                {selectedMethod?.unit || "개"}
              </span>
            </div>
          </div>

          {/* 면적 */}
          <div>
            <label
              htmlFor="areaSize"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              면적 <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                id="areaSize"
                name="areaSize"
                value={formData.areaSize}
                onChange={handleChange}
                placeholder="0"
                min="0"
                step="0.1"
                className="w-full px-4 py-2.5 pr-12 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2C67BC]/20 focus:border-[#2C67BC]"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                m²
              </span>
            </div>
          </div>
        </div>

        {/* 착생 상태 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            착생 상태 <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-3">
            {attachmentStatuses.map((status) => (
              <label
                key={status.value}
                className={`relative flex items-center justify-center px-4 py-3 rounded-lg border-2 cursor-pointer transition-all ${
                  formData.attachmentStatus === status.value
                    ? `${status.color} ring-2 ${status.activeColor}`
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="attachmentStatus"
                  value={status.value}
                  checked={formData.attachmentStatus === status.value}
                  onChange={handleChange}
                  className="sr-only"
                />
                <span className="font-medium">{status.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
