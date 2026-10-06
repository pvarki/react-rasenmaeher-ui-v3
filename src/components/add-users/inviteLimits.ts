import { type InviteLimits, UNLIMITED } from "@/hooks/api/invites/useInvites";

export interface InviteLimitsForm {
  maxUses: string;
  expiresAt: string;
}

export const noLimits: InviteLimitsForm = { maxUses: "", expiresAt: "" };

export function isValidLimits({ maxUses }: InviteLimitsForm) {
  if (maxUses === "") return true;

  const uses = Number(maxUses);
  return Number.isInteger(uses) && uses >= 1;
}

export function toInviteLimits({
  maxUses,
  expiresAt,
}: InviteLimitsForm): InviteLimits {
  return {
    useCount: maxUses === "" ? UNLIMITED : Number(maxUses),
    validUntil: expiresAt === "" ? null : new Date(expiresAt).toISOString(),
  };
}
