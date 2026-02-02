import * as z from "zod";

export const registerSchema = z.object({
  id: z
    .string()
    .min(1, "아이디를 입력하세요.")
    .max(20, "아이디는 20자 이내여야 합니다."),
  password: z
    .string()
    .min(8, "비밀번호는 최소 8자 이상이어야 합니다.")
    .regex(/[a-zA-Z]/, "비밀번호에 영문이 포함되어야 합니다.")
    .regex(/[0-9]/, "비밀번호에 숫자가 포함되어야 합니다."),
  email: z.email({ message: "올바른 이메일 형식이 아닙니다." }),
  phone: z
    .string()
    .min(10, "전화번호를 입력하세요.")
    .regex(/^[0-9]+$/, "전화번호는 숫자만 입력 가능합니다."),
  nickname: z.string().min(1, "닉네임을 입력하세요."),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
