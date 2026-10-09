import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { DisableGuidesButton } from "@/components/guides/DisableGuidesButton";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  type Invite,
  type InviteLimits,
  inviteStatus,
} from "@/hooks/api/invites/useInvites";
import { InviteLimitsFields } from "@/components/add-users/InviteLimitsFields";
import {
  fromInvite,
  isValidLimits,
  noLimits,
  toInviteLimits,
} from "@/components/add-users/inviteLimits";

interface CreateInviteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (limits: InviteLimits) => void;
  isCreating: boolean;
}

export function CreateInviteDialog({
  open,
  onOpenChange,
  onConfirm,
  isCreating,
}: CreateInviteDialogProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" data-testid="create-invite-dialog">
        <DialogHeader>
          <DialogTitle>{t("addUsers.createModalTitle")}</DialogTitle>
          <DialogDescription>
            {t("addUsers.createModalDescription")}
          </DialogDescription>
        </DialogHeader>
        <CreateInviteForm
          onCancel={() => onOpenChange(false)}
          onConfirm={onConfirm}
          isCreating={isCreating}
        />
      </DialogContent>
    </Dialog>
  );
}

function CreateInviteForm({
  onCancel,
  onConfirm,
  isCreating,
}: {
  onCancel: () => void;
  onConfirm: (limits: InviteLimits) => void;
  isCreating: boolean;
}) {
  const { t } = useTranslation();
  const [limits, setLimits] = useState(noLimits);

  return (
    <>
      <InviteLimitsFields value={limits} onChange={setLimits} />
      <div className="flex gap-3 pt-4 flex-col sm:flex-row">
        <Button
          variant="outline"
          onClick={onCancel}
          className="flex-1 h-11"
          data-testid="create-invite-cancel"
        >
          {t("addUsers.cancel")}
        </Button>
        <Button
          onClick={() => onConfirm(toInviteLimits(limits))}
          variant={"outline"}
          className="flex-1 h-11 bg-primary-light hover:bg-primary-light/90"
          disabled={isCreating || !isValidLimits(limits)}
          data-testid="create-invite-confirm"
        >
          {isCreating ? t("addUsers.creating") : t("addUsers.createModalTitle")}
        </Button>
      </div>
    </>
  );
}

interface ManageCodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCode: string | null;
  inviteCodes?: Invite[];
  onSave: (limits: InviteLimits) => void;
  onDisable: () => void;
  onDelete: () => void;
  isDeleting: boolean;
  isUpdating: boolean;
}

export function ManageCodeDialog({
  open,
  onOpenChange,
  selectedCode,
  inviteCodes,
  onSave,
  onDisable,
  onDelete,
  isDeleting,
  isUpdating,
}: ManageCodeDialogProps) {
  const { t } = useTranslation();
  const selectedInvite = inviteCodes?.find((c) => c.code === selectedCode);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md"
        data-testid="manage-code-dialog"
        data-invite-code={selectedCode ?? ""}
      >
        <DialogHeader>
          <DialogTitle className="font-mono">{selectedCode}</DialogTitle>
          <DialogDescription>
            {selectedInvite?.createdAt &&
              t("addUsers.created", {
                date: format(
                  new Date(selectedInvite.createdAt),
                  "MMM d, yyyy HH:mm",
                ),
              })}
          </DialogDescription>
        </DialogHeader>
        {selectedInvite && (
          <ManageInviteForm
            key={selectedInvite.code}
            invite={selectedInvite}
            onSave={onSave}
            onDisable={onDisable}
            onDelete={onDelete}
            busy={isUpdating || isDeleting}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function ManageInviteForm({
  invite,
  onSave,
  onDisable,
  onDelete,
  busy,
}: {
  invite: Invite;
  onSave: (limits: InviteLimits) => void;
  onDisable: () => void;
  onDelete: () => void;
  busy: boolean;
}) {
  const { t } = useTranslation();
  const [initial] = useState(() => fromInvite(invite));
  const [limits, setLimits] = useState(initial);
  const changed =
    limits.maxUses !== initial.maxUses ||
    limits.expiresAt !== initial.expiresAt;

  return (
    <>
      <InviteLimitsFields value={limits} onChange={setLimits} />
      <div className="flex gap-3 pt-4 flex-col sm:flex-row">
        {inviteStatus(invite) !== "expired" && (
          <Button
            variant="outline"
            onClick={onDisable}
            className="flex-1 h-11 bg-transparent"
            disabled={busy}
            data-testid="manage-code-disable-button"
          >
            {t("addUsers.disable")}
          </Button>
        )}
        <Button
          variant="destructive"
          onClick={onDelete}
          className="flex-1 h-11"
          disabled={busy}
          data-testid="manage-code-delete-button"
        >
          {t("addUsers.delete")}
        </Button>
        <Button
          onClick={() => onSave(toInviteLimits(limits))}
          variant={"outline"}
          className="flex-1 h-11 bg-primary-light hover:bg-primary-light/90"
          disabled={busy || !changed || !isValidLimits(limits)}
          data-testid="manage-code-save-button"
        >
          {t("addUsers.save")}
        </Button>
      </div>
    </>
  );
}

interface WalkthroughDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WalkthroughDialog({
  open,
  onOpenChange,
}: WalkthroughDialogProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("addUsers.walkthrough.title")}</DialogTitle>
          <DialogDescription>
            {t("addUsers.walkthrough.description")}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[330px] rounded-md">
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">
                {t("addUsers.walkthrough.step1Title")}
              </h4>
              <p className="text-sm text-muted-foreground">
                {t("addUsers.walkthrough.step1Description")}
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">
                {t("addUsers.walkthrough.step2Title")}
              </h4>
              <p className="text-sm text-muted-foreground">
                {t("addUsers.walkthrough.step2Description")}
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">
                {t("addUsers.walkthrough.step3Title")}
              </h4>
              <p className="text-sm text-muted-foreground">
                {t("addUsers.walkthrough.step3Description")}
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">
                {t("addUsers.walkthrough.managingTitle")}
              </h4>
              <p className="text-sm text-muted-foreground">
                • {t("addUsers.walkthrough.managingBullet1")}
                <br />• {t("addUsers.walkthrough.managingBullet2")}
                <br />• {t("addUsers.walkthrough.managingBullet3")}
              </p>
            </div>
          </div>
        </ScrollArea>
        <DisableGuidesButton onDismiss={() => onOpenChange(false)} />
        <DialogFooter>
          <Button
            onClick={() => onOpenChange(false)}
            className="w-full bg-primary-light hover:bg-primary-light/90"
            variant={"outline"}
          >
            {t("addUsers.walkthrough.gotIt")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
