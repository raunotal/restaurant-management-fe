export type ErrorCode =
  | "IMAGE_NO_FILE"
  | "IMAGE_TOO_LARGE_AFTER_COMPRESSION"
  | "IMAGE_COMPRESSION_FAILED"
  | "IMAGE_UPLOAD_FAILED"
  | "IMAGE_URL_REQUIRED"
  | "IMAGE_DELETE_FAILED"
  | "UNKNOWN_ERROR";

const ESTONIAN_ERROR_MESSAGES: Record<ErrorCode, string> = {
  IMAGE_NO_FILE: "Faili ei valitud.",
  IMAGE_TOO_LARGE_AFTER_COMPRESSION:
    "Pilt jäi ka pärast töötlemist liiga suureks. Palun kasuta väiksemat või madalama kvaliteediga pilti.",
  IMAGE_COMPRESSION_FAILED:
    "Pildi töötlemine ebaõnnestus. Palun proovi teise pildifailiga.",
  IMAGE_UPLOAD_FAILED:
    "Pildi üleslaadimine ebaõnnestus. Palun proovi mõne aja pärast uuesti.",
  IMAGE_URL_REQUIRED:
    "Pildi kustutamine ebaõnnestus, sest pildi aadress on puudu.",
  IMAGE_DELETE_FAILED:
    "Pildi kustutamine ebaõnnestus. Palun proovi mõne aja pärast uuesti.",
  UNKNOWN_ERROR: "Midagi läks valesti. Palun proovi uuesti.",
};

export const getErrorMessageEt = (code?: string) => {
  if (!code) return ESTONIAN_ERROR_MESSAGES.UNKNOWN_ERROR;
  return (
    ESTONIAN_ERROR_MESSAGES[code as ErrorCode] ??
    ESTONIAN_ERROR_MESSAGES.UNKNOWN_ERROR
  );
};

