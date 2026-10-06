import { useTranslation } from "react-i18next";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { InviteLimitsForm } from "@/components/add-users/inviteLimits";

interface InviteLimitsFieldsProps {
  value: InviteLimitsForm;
  onChange: (value: InviteLimitsForm) => void;
}

export function InviteLimitsFields({
  value,
  onChange,
}: InviteLimitsFieldsProps) {
  const { t } = useTranslation();

  return (
    <FieldGroup className="gap-4">
      <Field>
        <FieldLabel htmlFor="invite-max-uses">
          {t("addUsers.maxUses")}
        </FieldLabel>
        <Input
          id="invite-max-uses"
          type="number"
          min={1}
          step={1}
          inputMode="numeric"
          value={value.maxUses}
          onChange={(e) => onChange({ ...value, maxUses: e.target.value })}
          data-testid="invite-max-uses"
        />
        <FieldDescription>{t("addUsers.maxUsesHint")}</FieldDescription>
      </Field>
      <Field>
        <FieldLabel htmlFor="invite-expires-at">
          {t("addUsers.expiresAt")}
        </FieldLabel>
        <Input
          id="invite-expires-at"
          type="datetime-local"
          value={value.expiresAt}
          onChange={(e) => onChange({ ...value, expiresAt: e.target.value })}
          data-testid="invite-expires-at"
        />
        <FieldDescription>{t("addUsers.expiresAtHint")}</FieldDescription>
      </Field>
    </FieldGroup>
  );
}
