// // src/hooks/useUpdateMyInfo.ts
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { updateMyInfo } from "@/api/user";
// import type { ApiResp, MyInfo } from "@/types/api";
// import { queryKeys } from "@/hooks/queryKeys";

// type Form = { nickname: string; email: string; phone: string };

// export function useUpdateMyInfo() {
//   const qc = useQueryClient();

//   return useMutation<ApiResp<boolean>, unknown, Form>({
//     mutationFn: (form) => updateMyInfo(form.nickname, form.email, form.phone),

//     onSuccess: (_res, variables) => {
//       // ✅ old가 ApiResp<MyInfo>로 추론되므로 .data 접근 OK
//       qc.setQueryData<ApiResp<MyInfo>>(queryKeys.myInfo, (old) => {
//         if (!old) return old;
//         return { ...old, data: { ...old.data, ...variables } };
//       });

//       // (선택) 백그라운드 재조회
//       qc.invalidateQueries({ queryKey: queryKeys.myInfo });
//     },
//   });
// }
