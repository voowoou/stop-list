export function errorResponse(
  status: number,
  code: string,
  message: string,
  fieldErrors?: Record<string, string[]>,
): Response {
  const body = {
    error: {
      code,
      message,
      ...(fieldErrors ? { fieldErrors } : {}),
    },
  };

  return Response.json(body, { status });
}
