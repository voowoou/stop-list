import { ApiError } from "./api-error";

const DEFAULT_ERROR_MESSAGE = "Не удалось выполнить запрос";

export async function fetchJson<TResponse>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<TResponse> {
  const response = await fetch(input, init);
  const body = await readJson(response);

  if (!response.ok) {
    if (isApiErrorBody(body)) {
      throw new ApiError(
        response.status,
        body.error.code,
        body.error.message,
        body.error.fieldErrors,
      );
    }

    throw new ApiError(response.status, "UNKNOWN_ERROR", DEFAULT_ERROR_MESSAGE);
  }

  if (body === null) {
    throw new ApiError(
      response.status,
      "INVALID_RESPONSE",
      "Сервер вернул некорректный ответ",
    );
  }

  return body as TResponse;
}

async function readJson(response: Response): Promise<unknown | null> {
  try {
    return (await response.json()) as unknown;
  } catch {
    return null;
  }
}

function isApiErrorBody(value: unknown): value is {
  error: {
    code: string;
    message: string;
    fieldErrors?: Record<string, string[]>;
  };
} {
  if (!isRecord(value) || !isRecord(value.error)) return false;

  return (
    typeof value.error.code === "string" &&
    typeof value.error.message === "string"
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
