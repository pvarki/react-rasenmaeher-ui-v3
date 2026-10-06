import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { ApiError } from "@/lib/ApiError";
import type { Invite, InviteLimits } from "./useInvites";

export interface UpdateInviteRequest extends Partial<InviteLimits> {
  code: string;
}

async function updateInvite({ code, ...changes }: UpdateInviteRequest) {
  const res = await fetch(`/api/v3/invites/${encodeURIComponent(code)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(changes),
  });
  if (!res.ok) throw new ApiError(res.status);

  return (await res.json()) as Invite;
}

type UseUpdateInviteOptions = Omit<
  UseMutationOptions<Invite, Error, UpdateInviteRequest>,
  "mutationFn"
>;

export function useUpdateInvite(options?: UseUpdateInviteOptions) {
  return useMutation({ mutationFn: updateInvite, ...options });
}
