import { HttpErrorCode } from "~/constants/http-error";
import { auth, via } from "~/utils/auth";
import { defineEndpoint } from "~/utils/define/endpoint";
import { httpError } from "~/utils/http-error";

export default defineEndpoint(async ({ request }) => {
    const user = await auth(via(request));
    if (!user) httpError(HttpErrorCode.InvalidAuthorization);

    switch (request.method) {
        case "GET": return Response.json(user);
    }

    httpError(HttpErrorCode.NotFound);
});