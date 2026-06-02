export const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (typeof error === "object" && error !== null) {
    const response = (error as { response?: { data?: { error?: unknown } } }).response;
    const serverError = response?.data?.error;

    if (typeof serverError === "string" && serverError.trim()) {
      return serverError;
    }
  }

  return fallback;
};
