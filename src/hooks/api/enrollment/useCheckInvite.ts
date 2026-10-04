import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { ApiError } from "@/lib/ApiError";

async function checkInvite(code: string) {
  const res = await fetch("/api/v3/enrollment/check", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });
  if (!res.ok) throw new ApiError(res.status);

  const { valid } = (await res.json()) as { valid: boolean };
  return valid;
}

type UseCheckInviteOptions = Omit<
  UseMutationOptions<boolean, Error, string>,
  "mutationFn"
>;

export function useCheckInvite(options?: UseCheckInviteOptions) {
  return useMutation({ mutationFn: checkInvite, ...options });
}
