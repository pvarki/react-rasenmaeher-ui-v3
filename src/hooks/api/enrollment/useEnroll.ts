import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { ApiError } from "@/lib/ApiError";
import { saveToken } from "./enrollmentToken";

export interface EnrollmentStatus {
  callsign: string;
  approvalCode: string | null;
  approved: boolean;
}

interface Token {
  accessToken: string;
  tokenType: "Bearer";
  expiresAt: string;
}

export interface EnrollRequest {
  code: string;
  callsign: string;
}

/** Redeems an invite code for a callsign and saves the returned enrollment token. */
async function enroll(request: EnrollRequest) {
  const res = await fetch("/api/v3/enrollment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
  if (!res.ok) throw new ApiError(res.status);

  const { status, token } = (await res.json()) as {
    status: EnrollmentStatus;
    token: Token;
  };
  saveToken(token.accessToken);
  return status;
}

type UseEnrollOptions = Omit<
  UseMutationOptions<EnrollmentStatus, Error, EnrollRequest>,
  "mutationFn"
>;

export function useEnroll(options?: UseEnrollOptions) {
  return useMutation({ mutationFn: enroll, ...options });
}
