"use client";

import { useState } from "react";
import { ArrowLeft, Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useSpecies } from "@/hooks/useSpecies";
import {
  useCreateSpecies,
  useUpdateSpecies,
  useDeleteSpecies,
} from "./hooks/useSpeciesMutations";

export default function SpeciesCreatePage() {
  const router = useRouter();
  const { checking } = useAuthGuard({ mode: "gotoLogin" });
  const { data, isLoading } = useSpecies();
  const createMutation = useCreateSpecies();
  const deleteMutation = useDeleteSpecies();

  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");

  const handleCreate = () => {
    if (!newName.trim()) return;
    createMutation.mutate({ name: newName.trim() }, {
      onSuccess: () => setNewName(""),
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      deleteMutation.mutate(id);
    }
  };

  const startEdit = (id: number, name: string) => {
    setEditingId(id);
    setEditingName(name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50">
      <div className="mx-auto max-w-[900px] p-4">
        {/* 페이지 헤더 */}
        <div className="mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 -ml-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div className="flex w-full justify-between gap-3">
              <h1 className="text-2xl font-bold text-gray-900">종 관리</h1>
              <p className="text-sm text-gray-500 self-end">
                이식, 성장기록 등 데이터를 추가할 때 사용할 종들을 추가/삭제
                합니다.
              </p>
            </div>
          </div>
        </div>

        {/* 종 추가 입력 */}
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            placeholder="새 종 이름 입력"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleCreate}
            disabled={createMutation.isPending || !newName.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            추가
          </button>
        </div>

        {/* 종 목록 */}
        <div className="bg-white rounded-lg border border-gray-200">
          {checking || isLoading ? (
            <div className="p-8 text-center text-gray-500">로딩 중...</div>
          ) : !data?.length ? (
            <div className="p-8 text-center text-gray-500">
              등록된 종이 없습니다.
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {data.map((species) => (
                <SpeciesItem
                  key={species.id}
                  species={species}
                  isEditing={editingId === species.id}
                  editingName={editingName}
                  setEditingName={setEditingName}
                  onStartEdit={() => startEdit(species.id, species.name)}
                  onCancelEdit={cancelEdit}
                  onDelete={() => handleDelete(species.id)}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function SpeciesItem({
  species,
  isEditing,
  editingName,
  setEditingName,
  onStartEdit,
  onCancelEdit,
  onDelete,
}: {
  species: { id: number; name: string };
  isEditing: boolean;
  editingName: string;
  setEditingName: (name: string) => void;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onDelete: () => void;
}) {
  const updateMutation = useUpdateSpecies(species.id);

  const handleUpdate = () => {
    if (!editingName.trim()) return;
    updateMutation.mutate(editingName.trim(), {
      onSuccess: onCancelEdit,
    });
  };

  if (isEditing) {
    return (
      <li className="flex items-center gap-2 p-3">
        <input
          type="text"
          value={editingName}
          onChange={(e) => setEditingName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleUpdate();
            if (e.key === "Escape") onCancelEdit();
          }}
          className="flex-1 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />
        <button
          onClick={handleUpdate}
          disabled={updateMutation.isPending}
          className="p-2 text-green-600 hover:bg-green-50 rounded"
        >
          <Check className="h-4 w-4" />
        </button>
        <button
          onClick={onCancelEdit}
          className="p-2 text-gray-500 hover:bg-gray-100 rounded"
        >
          <X className="h-4 w-4" />
        </button>
      </li>
    );
  }

  return (
    <li className="flex items-center justify-between p-3 hover:bg-gray-50">
      <span className="text-gray-900">{species.name}</span>
      <div className="flex gap-1">
        <button
          onClick={onStartEdit}
          className="p-2 text-gray-500 hover:bg-gray-100 rounded"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          onClick={onDelete}
          className="p-2 text-red-500 hover:bg-red-50 rounded"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </li>
  );
}
