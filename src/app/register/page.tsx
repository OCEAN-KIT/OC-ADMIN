// app/register/page.tsx
"use client";

import { useState } from "react";
import { registerSchema, RegisterFormData } from "@/lib/validation/register";
import { signUp1, signUp2, signUp3 } from "@/api/auth";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

export default function RegisterPage() {
  const [form, setForm] = useState<RegisterFormData>({
    id: "",
    password: "",
    email: "",
    phone: "",
    nickname: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 선검증: 비밀번호 일치
    if (form.password.trim() !== confirmPassword.trim()) {
      setErrorMsg("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      registerSchema.parse(form);
      setErrorMsg("");

      // 가입 흐름 (요청대로 유지)
      await signUp1(form.id, form.password);

      const res2 = await signUp2(form.id, form.password);
      const token = res2.data.access;

      await signUp3(form.nickname, form.email, form.phone);

      router.push("/home");
    } catch (err: unknown) {
      console.error("회원가입 에러:", err);
      const axiosErr = err as AxiosError;

      if (axiosErr.response?.status === 409) {
        setErrorMsg("이미 사용 중인 아이디입니다.");
      } else if (
        err &&
        typeof err === "object" &&
        "errors" in (err as Record<string, unknown>)
      ) {
        const zodErr = err as { errors: { message: string }[] };
        setErrorMsg(zodErr.errors[0].message);
      } else {
        setErrorMsg("회원가입 중 오류가 발생했습니다.");
      }
    }
  };

  // 버튼 활성화 조건: 모든 필드 채움 + 비밀번호 일치
  const isAllFilled =
    form.id.trim() &&
    form.password.trim() &&
    confirmPassword.trim() &&
    form.email.trim() &&
    form.phone.trim() &&
    form.nickname.trim();

  const isPwMatched =
    !confirmPassword || form.password.trim() === confirmPassword.trim();

  const canSubmit = Boolean(isAllFilled && isPwMatched);

  return (
    <div
      className="min-h-[calc(100dvh-4rem)] bg-gray-50 text-gray-900 flex items-center justify-center px-4 py-10"
      style={{
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <main className="w-full max-w-md">
        <div className="rounded-3xl bg-white/80 backdrop-blur border border-gray-100 shadow-xl px-8 py-10">
          {/* 브랜드 영역 (로그인 페이지 톤 매칭) */}
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight">
              OceanCampus
            </h1>
            <p className="mt-2 text-sm text-gray-500">관리자 계정 생성</p>
          </div>

          {errorMsg && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMsg}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            method="post"
            action="#"
            noValidate
            className="space-y-4"
          >
            {/* 아이디(이메일 형태라면 placeholder만 예시) */}
            <div className="space-y-2">
              <label className="block text-[13px] font-medium text-gray-700">
                아이디
              </label>
              <input
                name="id"
                type="text"
                value={form.id}
                onChange={handleChange}
                placeholder="get@ziontutorial.com"
                autoComplete="username"
                className="h-12 w-full rounded-xl border-0 ring-1 ring-gray-200 bg-white px-4 text-[15px]
                           placeholder:text-gray-400 focus:ring-2 focus:ring-[#34609E] focus:outline-none"
              />
            </div>

            {/* 비밀번호 */}
            <div className="space-y-2">
              <label className="block text-[13px] font-medium text-gray-700">
                비밀번호
              </label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="비밀번호를 입력하세요"
                autoComplete="new-password"
                className="h-12 w-full rounded-xl border-0 ring-1 ring-gray-200 bg-white px-4 text-[15px]
                           placeholder:text-gray-400 focus:ring-2 focus:ring-[#34609E] focus:outline-none"
              />
            </div>

            {/* 비밀번호 확인 */}
            <div className="space-y-2">
              <label className="block text-[13px] font-medium text-gray-700">
                비밀번호 확인
              </label>
              <input
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="비밀번호를 한 번 더 입력하세요"
                autoComplete="new-password"
                className={`h-12 w-full rounded-xl border-0 ring-1 bg-white px-4 text-[15px]
                            placeholder:text-gray-400 focus:ring-2 focus:outline-none
                            ${
                              confirmPassword && !isPwMatched
                                ? "ring-red-300 focus:ring-red-400"
                                : "ring-gray-200 focus:ring-[#34609E]"
                            }`}
              />
              {confirmPassword && !isPwMatched && (
                <p className="text-xs text-red-600">
                  비밀번호가 일치하지 않습니다.
                </p>
              )}
            </div>

            {/* 이메일 */}
            <div className="space-y-2">
              <label className="block text-[13px] font-medium text-gray-700">
                이메일
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="이메일을 입력하세요"
                autoComplete="email"
                className="h-12 w-full rounded-xl border-0 ring-1 ring-gray-200 bg-white px-4 text-[15px]
                           placeholder:text-gray-400 focus:ring-2 focus:ring-[#34609E] focus:outline-none"
              />
            </div>

            {/* 전화번호 */}
            <div className="space-y-2">
              <label className="block text-[13px] font-medium text-gray-700">
                전화번호
              </label>
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="전화번호를 입력하세요"
                autoComplete="tel"
                className="h-12 w-full rounded-xl border-0 ring-1 ring-gray-200 bg-white px-4 text-[15px]
                           placeholder:text-gray-400 focus:ring-2 focus:ring-[#34609E] focus:outline-none"
              />
            </div>

            {/* 닉네임 */}
            <div className="space-y-2">
              <label className="block text-[13px] font-medium text-gray-700">
                닉네임
              </label>
              <input
                name="nickname"
                type="text"
                value={form.nickname}
                onChange={handleChange}
                placeholder="닉네임을 입력하세요"
                className="h-12 w-full rounded-xl border-0 ring-1 ring-gray-200 bg-white px-4 text-[15px]
                           placeholder:text-gray-400 focus:ring-2 focus:ring-[#34609E] focus:outline-none"
              />
            </div>

            {/* 제출 버튼 */}
            <button
              type="submit"
              disabled={!canSubmit}
              aria-disabled={!canSubmit}
              className={`mt-6 h-12 w-full rounded-xl text-white text-[15px] font-semibold shadow-md transition
                ${
                  canSubmit
                    ? "bg-[#3263F1] hover:brightness-105 active:translate-y-[1px]"
                    : "bg-[#3263F1]/50 cursor-not-allowed"
                }`}
            >
              회원가입
            </button>

            {/* 하단 구분선 & 로그인 링크 (선택) */}
            <div className="my-6 flex items-center">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="mx-3 whitespace-nowrap text-sm text-gray-500">
                이미 계정이 있으신가요?
              </span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2
                           text-sm text-gray-700 hover:bg-gray-100 active:translate-y-[1px] transition"
              >
                로그인으로 이동
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
