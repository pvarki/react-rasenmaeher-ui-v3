import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
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
          placeholder={t("addUsers.unlimited")}
          value={value.maxUses}
          onChange={(e) => onChange({ ...value, maxUses: e.target.value })}
          data-testid="invite-max-uses"
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="invite-expires-at">
          {t("addUsers.expiresAt")}
        </FieldLabel>
        <InputGroup>
          <InputGroupInput
            id="invite-expires-at"
            type="datetime-local"
            value={value.expiresAt}
            onChange={(e) => onChange({ ...value, expiresAt: e.target.value })}
            data-testid="invite-expires-at"
          />
          {value.expiresAt && (
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                size="icon-xs"
                aria-label={t("addUsers.noExpiry")}
                title={t("addUsers.noExpiry")}
                onClick={() => onChange({ ...value, expiresAt: "" })}
                data-testid="invite-expires-at-clear"
              >
                <X />
              </InputGroupButton>
            </InputGroupAddon>
          )}
        </InputGroup>
      </Field>
    </FieldGroup>
  );
}
