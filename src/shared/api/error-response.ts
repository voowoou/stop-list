import type { ApiErrorResponse, StopItemPayload } from "@/types/menu";

export function errorResponse(
  status: number,
  code: string,
  message: string,
  fieldErrors?: Partial<Record<keyof StopItemPayload, string[]>>,
): Response {
  const body: ApiErrorResponse = {
    error: {
      code,
      message,
      ...(fieldErrors ? { fieldErrors } : {}),
    },
  };

  return Response.json(body, { status });
}
