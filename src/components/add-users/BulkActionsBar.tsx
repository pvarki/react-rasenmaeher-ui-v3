import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface BulkActionsBarProps {
  selectedCount: number;
  onDisable: () => void;
  onDelete: () => void;
}

export function BulkActionsBar({
  selectedCount,
  onDisable,
  onDelete,
}: BulkActionsBarProps) {
  const { t } = useTranslation();

  if (selectedCount === 0) return null;

  return (
    <div
      className="grid md:grid-cols-2 gap-2 p-4 bg-card border border-border rounded-xl"
      data-testid="bulk-actions-bar"
    >
      <Button
        variant="outline"
        size="sm"
        onClick={onDisable}
        data-testid="bulk-disable-button"
      >
        {t("addUsers.disable")}
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={onDelete}
        data-testid="bulk-delete-button"
      >
        {t("addUsers.delete")}
      </Button>
    </div>
  );
}
