import type React from "react";
import { MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import {
  type Invite,
  UNLIMITED,
  inviteStatus,
} from "@/hooks/api/invites/useInvites";

interface InviteCodeItemProps {
  invite: Invite;
  bulkMode: boolean;
  isSelected: boolean;
  onCodeClick: (code: string, e: React.MouseEvent) => void;
  onManageClick: (code: string, e: React.MouseEvent) => void;
  onToggleSelection: (code: string) => void;
}

const formatDate = (date: string) => format(new Date(date), "MMM d, yyyy");

export function InviteCodeItem({
  invite,
  bulkMode,
  isSelected,
  onCodeClick,
  onManageClick,
  onToggleSelection,
}: InviteCodeItemProps) {
  const { t } = useTranslation();
  const status = inviteStatus(invite);
  const active = status === "active";

  const handleClick = (e: React.MouseEvent) => {
    if (bulkMode) {
      onToggleSelection(invite.code);
    } else {
      if (!active) return;
      onCodeClick(invite.code, e);
    }
  };

  const limits = [
    invite.useCount === UNLIMITED
      ? t("addUsers.usesUnlimited", { used: invite.used })
      : t("addUsers.uses", { used: invite.used, useCount: invite.useCount }),
    invite.validUntil
      ? t("addUsers.expires", { date: formatDate(invite.validUntil) })
      : t("addUsers.noExpiry"),
  ];

  return (
    <div
      onClick={handleClick}
      data-testid="invite-code-item"
      data-invite-code={invite.code}
      data-invite-active={active ? "true" : "false"}
      data-invite-selected={isSelected ? "true" : "false"}
      className={cn(
        "flex items-center justify-between p-5 bg-card border-2 border-border rounded-xl hover:bg-accent/50 hover:border-primary/50 transition-all",
        bulkMode && isSelected && "bg-accent border-primary",
        active ? "cursor-pointer" : "cursor-not-allowed",
      )}
    >
      <div className="flex items-center gap-4 flex-1">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span
              className="font-mono font-bold text-lg"
              data-testid="invite-code-value"
            >
              {invite.code}
            </span>
            <span
              data-testid="invite-code-status"
              data-invite-status={status}
              className={cn(
                "text-xs font-bold uppercase px-3 py-0.5 rounded-full",
                active
                  ? "text-green-600 bg-green-100 dark:bg-green-900/30"
                  : "text-gray-500 bg-gray-100 dark:bg-gray-800",
              )}
            >
              {t(`addUsers.${status}`)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {limits.join(" - ")}
          </p>
        </div>
      </div>
      {!bulkMode && (
        <button
          onClick={(e) => onManageClick(invite.code, e)}
          className="text-muted-foreground hover:text-foreground p-2"
          data-testid="invite-code-manage-button"
        >
          <MoreVertical className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
