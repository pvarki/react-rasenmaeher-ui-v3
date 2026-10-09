import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { ApiError } from "@/lib/ApiError";

// returned useCount when unlimited
export const UNLIMITED = -1;

export interface InviteLimits {
  useCount: number;
  validUntil: string | null;
}

export interface Invite extends InviteLimits {
  code: string;
  used: number;
  createdAt: string | null;
}

export type InviteStatus = "active" | "expired" | "usedUp";

export function inviteStatus(invite: Invite): InviteStatus {
  if (invite.validUntil && new Date(invite.validUntil) <= new Date()) {
    return "expired";
  }
  if (invite.useCount !== UNLIMITED && invite.used >= invite.useCount) {
    return "usedUp";
  }
  return "active";
}

async function getInvites() {
  const res = await fetch("/api/v3/invites");
  if (!res.ok) throw new ApiError(res.status);

  return (await res.json()) as Invite[];
}

type UseInvitesOptions = Omit<
  UseQueryOptions<Invite[], Error>,
  "queryKey" | "queryFn"
>;

export function useInvites(options?: UseInvitesOptions) {
  return useQuery({ queryKey: ["invites"], queryFn: getInvites, ...options });
}
