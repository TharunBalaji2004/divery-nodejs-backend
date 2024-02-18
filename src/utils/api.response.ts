export type ApiResponse<T> = {
  success: boolean;
  message: string;
  result?: T | null;
  error?: ApiError | null;
};

type ApiError = {
  message: any;
};
