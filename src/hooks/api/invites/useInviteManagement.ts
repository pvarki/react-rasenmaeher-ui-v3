import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { type InviteLimits, useInvites } from "@/hooks/api/invites/useInvites";
import { useCreateInvite } from "@/hooks/api/invites/useCreateInvite";
import { useDeleteInvite } from "@/hooks/api/invites/useDeleteInvite";
import {
  type UpdateInviteRequest,
  useUpdateInvite,
} from "@/hooks/api/invites/useUpdateInvite";
import { ApiError } from "@/lib/ApiError";
import { useUserType } from "@/hooks/auth/useUserType";
import { useGuidePreferences } from "@/hooks/useGuidePreferences";

export function useInviteManagement() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { userType, isLoading: userTypeLoading, callsign } = useUserType();
  const { autoOpen } = useGuidePreferences();

  const [filterText, setFilterText] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [manageDialogOpen, setManageDialogOpen] = useState(false);
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);
  const [bulkMode, setBulkMode] = useState(false);
  const [walkthroughOpen, setWalkthroughOpen] = useState(false);

  const {
    data: inviteCodes,
    isLoading,
    refetch,
  } = useInvites({
    refetchInterval: 10000,
  });

  const createInviteMutation = useCreateInvite({
    onSuccess: (invite) => {
      toast.success(t("addUsers.messages.codeCreated"));
      setCreateModalOpen(false);
      refetch();
      navigate({ to: "/invite-code/$code", params: { code: invite.code } });
    },
    onError: (error) => {
      toast.error(t("addUsers.messages.createError", { error: error.message }));
    },
  });

  const deleteInviteMutation = useDeleteInvite({
    onSuccess: () => {
      toast.success(t("addUsers.messages.codeDeleted"));
      setManageDialogOpen(false);
      setSelectedCode(null);
      refetch();
    },
    onError: (error) => {
      toast.error(t("addUsers.messages.deleteError", { error: error.message }));
    },
  });

  const updateInviteMutation = useUpdateInvite();

  const updateInvites = async (
    codes: string[],
    changes: Omit<UpdateInviteRequest, "code">,
  ) => {
    try {
      for (const code of codes) {
        await updateInviteMutation.mutateAsync({ code, ...changes });
      }
      return true;
    } catch (error) {
      toast.error(
        error instanceof ApiError && error.status === 409
          ? t("addUsers.messages.updateConflict")
          : t("addUsers.messages.updateError", {
              error: (error as Error).message,
            }),
      );
      return false;
    } finally {
      refetch();
    }
  };

  // Invites have no on/off switch, so disabling expires them right away
  const disableInvites = (codes: string[]) =>
    updateInvites(codes, { validUntil: new Date().toISOString() });

  // Auth checks
  useEffect(() => {
    if (!userTypeLoading && !callsign) {
      toast.error(t("addUsers.messages.noCallsignError"));
      navigate({ to: "/login" });
    }
  }, [callsign, userTypeLoading, navigate, t]);

  useEffect(() => {
    if (!userTypeLoading && userType !== "admin") {
      toast.error(t("addUsers.messages.forbiddenError"));
      navigate({ to: "/" });
    }
  }, [userType, userTypeLoading, navigate, t]);

  // Walkthrough on first visit
  useEffect(() => {
    // The help button still opens this; only the uninvited appearance stops.
    if (!autoOpen) return;
    const hasSeenWalkthrough = localStorage.getItem(
      `add-users-walkthrough-${callsign}`,
    );
    if (!hasSeenWalkthrough && !userTypeLoading) {
      setWalkthroughOpen(true);
      localStorage.setItem(`add-users-walkthrough-${callsign}`, "true");
    }
  }, [callsign, userTypeLoading, autoOpen]);

  // Reset selected code when dialog closes
  useEffect(() => {
    if (!manageDialogOpen) {
      setSelectedCode(null);
    }
  }, [manageDialogOpen]);

  const filteredCodes =
    inviteCodes?.filter((invite) =>
      invite.code.toLowerCase().includes(filterText.toLowerCase()),
    ) || [];

  const handleCreateInvite = (limits: InviteLimits) => {
    createInviteMutation.mutate(limits);
  };

  const handleDeleteCode = () => {
    if (!selectedCode) return;
    deleteInviteMutation.mutate(selectedCode);
  };

  const handleUpdateInvite = async (limits: InviteLimits) => {
    if (!selectedCode) return;
    if (!(await updateInvites([selectedCode], limits))) return;
    toast.success(t("addUsers.messages.codeUpdated"));
    setManageDialogOpen(false);
  };

  const handleDisableCode = async () => {
    if (!selectedCode) return;
    if (!(await disableInvites([selectedCode]))) return;
    toast.success(t("addUsers.messages.codeDeactivated"));
    setManageDialogOpen(false);
  };

  const handleCodeClick = (code: string) => {
    navigate({ to: "/invite-code/$code", params: { code } });
  };

  const handleManageClick = (code: string) => {
    setSelectedCode(code);
    setManageDialogOpen(true);
  };

  const handleBulkDelete = async () => {
    for (const code of selectedCodes) {
      await deleteInviteMutation.mutateAsync(code);
    }
    toast.success(
      t("addUsers.messages.codesDeleted", { count: selectedCodes.length }),
    );
    setSelectedCodes([]);
    setBulkMode(false);
    refetch();
  };

  const handleBulkDisable = async () => {
    if (!(await disableInvites(selectedCodes))) return;
    toast.success(
      t("addUsers.messages.codesDisabled", { count: selectedCodes.length }),
    );
    setSelectedCodes([]);
    setBulkMode(false);
  };

  const toggleCodeSelection = (code: string) => {
    setSelectedCodes((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code],
    );
  };

  const toggleBulkMode = () => {
    setBulkMode(!bulkMode);
    setSelectedCodes([]);
  };

  return {
    // State
    filterText,
    setFilterText,
    createModalOpen,
    setCreateModalOpen,
    selectedCode,
    manageDialogOpen,
    setManageDialogOpen,
    selectedCodes,
    bulkMode,
    walkthroughOpen,
    setWalkthroughOpen,
    // Data
    inviteCodes,
    filteredCodes,
    isLoading,
    userTypeLoading,
    userType,
    // Mutations loading states
    isCreating: createInviteMutation.isPending,
    isDeleting: deleteInviteMutation.isPending,
    isUpdating: updateInviteMutation.isPending,
    // Handlers
    handleCreateInvite,
    handleDeleteCode,
    handleUpdateInvite,
    handleDisableCode,
    handleCodeClick,
    handleManageClick,
    handleBulkDelete,
    handleBulkDisable,
    toggleCodeSelection,
    toggleBulkMode,
  };
}
