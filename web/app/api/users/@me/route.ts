import { HttpErrorCode } from "constants/http-error";
import { auth, via } from "utils/auth";
import { httpError } from "utils/http-error";

import { LoaderFunctionArgs } from "react-router";

export async function loader({ request }: LoaderFunctionArgs) {
    const user = await auth(via(request));
    if (!user) throw httpError(HttpErrorCode.InvalidAuthorization);

    switch (request.method) {
        case "GET": return Response.json(user);
    }

    throw httpError(HttpErrorCode.NotFound);
}