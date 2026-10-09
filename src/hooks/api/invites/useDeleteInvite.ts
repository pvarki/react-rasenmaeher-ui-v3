import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { ApiError } from "@/lib/ApiError";

async function deleteInvite(code: string) {
  const res = await fetch(`/api/v3/invites/${encodeURIComponent(code)}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new ApiError(res.status);
}

type UseDeleteInviteOptions = Omit<
  UseMutationOptions<void, Error, string>,
  "mutationFn"
>;

export function useDeleteInvite(options?: UseDeleteInviteOptions) {
  return useMutation({ mutationFn: deleteInvite, ...options });
}
