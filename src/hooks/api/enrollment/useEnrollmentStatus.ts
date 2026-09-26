import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { ApiError } from "@/lib/ApiError";
import { authHeader, hasToken } from "./enrollmentToken";
import type { EnrollmentStatus } from "./useEnroll";

export const isUnauthorized = (error: unknown) =>
  error instanceof ApiError && error.status === 401;

async function getEnrollmentStatus() {
  const res = await fetch("/api/v3/enrollment", { headers: authHeader() });
  if (!res.ok) throw new ApiError(res.status);

  return (await res.json()) as EnrollmentStatus;
}

type UseEnrollmentStatusOptions = Omit<
  UseQueryOptions<EnrollmentStatus, Error>,
  "queryKey" | "queryFn"
>;

export function useEnrollmentStatus(options?: UseEnrollmentStatusOptions) {
  return useQuery({
    queryKey: ["enrollment"],
    queryFn: getEnrollmentStatus,
    enabled: hasToken(),
    retry: (failureCount, error) => !isUnauthorized(error) && failureCount < 3,
    ...options,
  });
}
