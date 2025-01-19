import { HttpErrorCode } from "constants/http-error";
import { auth, via } from "utils/auth";
import { httpError } from "utils/http-error";

import { defineEndpoint } from "~/utils/define/endpoint";

export default defineEndpoint(async ({ request }) => {
    const user = await auth(via(request));
    if (!user) return httpError(HttpErrorCode.InvalidAuthorization);

    switch (request.method) {
        case "GET": return Response.json(user);
    }

    return httpError(HttpErrorCode.NotFound);
});