import { format } from "date-fns";
import {
  type Invite,
  type InviteLimits,
  UNLIMITED,
} from "@/hooks/api/invites/useInvites";

export interface InviteLimitsForm {
  maxUses: string;
  expiresAt: string;
}

export const noLimits: InviteLimitsForm = { maxUses: "", expiresAt: "" };

export function fromInvite(invite: Invite): InviteLimitsForm {
  return {
    maxUses: invite.useCount === UNLIMITED ? "" : String(invite.useCount),
    expiresAt: invite.validUntil
      ? format(new Date(invite.validUntil), "yyyy-MM-dd'T'HH:mm")
      : "",
  };
}

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
