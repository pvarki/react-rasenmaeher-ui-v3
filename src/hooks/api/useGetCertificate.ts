import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { ApiError } from "@/lib/ApiError";
import { downloadBlob } from "@/lib/downloadBlob";
import { authHeader } from "./enrollment/enrollmentToken";

async function getCertificate({
  callsign,
  deployment,
}: {
  callsign: string;
  deployment: string;
}) {
  const res = await fetch(
    `/api/v3/certificates/${callsign.toLowerCase()}.pfx`,
    { headers: authHeader() },
  );

  if (!res.ok) throw new ApiError(res.status);

  const blob = await res.blob();
  downloadBlob(blob, `${callsign}_${deployment}.pfx`);

  return blob;
}

type UseGetCertificateOptions = Omit<
  UseMutationOptions<Blob, Error, { callsign: string; deployment: string }>,
  "mutationFn"
>;

export function useGetCertificate(options?: UseGetCertificateOptions) {
  return useMutation({ mutationFn: getCertificate, ...options });
}
