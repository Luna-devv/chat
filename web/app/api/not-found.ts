import { HttpErrorCode } from "~/constants/http-error";
import { httpError } from "~/utils/http-error";

export function loader() {
    throw httpError(HttpErrorCode.NotFound);
}