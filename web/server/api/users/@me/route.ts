import { HttpErrorMessage } from "~/constants/http-error";
import { getUser } from "~/db/utils/users";
import { defineEndpoint, defineEndpointOptions } from "~/utils/define/endpoint";
import { httpError } from "~/utils/http-error";

const options = defineEndpointOptions({
    require_auth: true
});

export default defineEndpoint(async ({ request, userId }) => {
    if (request.method === "GET") return Response.json(await getUser(userId));
    httpError(HttpErrorMessage.NotFound);
}, options);