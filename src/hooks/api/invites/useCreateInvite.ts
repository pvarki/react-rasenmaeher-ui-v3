import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { ApiError } from "@/lib/ApiError";
import type { Invite, InviteLimits } from "./useInvites";

async function createInvite(limits: InviteLimits) {
  const res = await fetch("/api/v3/invites", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(limits),
  });
  if (!res.ok) throw new ApiError(res.status);

  return (await res.json()) as Invite;
}

type UseCreateInviteOptions = Omit<
  UseMutationOptions<Invite, Error, InviteLimits>,
  "mutationFn"
>;

export function useCreateInvite(options?: UseCreateInviteOptions) {
  return useMutation({ mutationFn: createInvite, ...options });
}
