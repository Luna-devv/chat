import type { ZodError, ZodIssue } from "zod";

import type { HttpErrorEntry } from "~/constants/http-error";
import { HttpErrorCode, HttpErrorMessage } from "~/constants/http-error";

export function httpError(code: HttpErrorEntry = HttpErrorCode.ServerError, message?: string | ZodError) {
    throw Response.json(
        {
            code,
            message: message
                ? (typeof message === "string" ? message : parseZodError(message))
                : getErrorMessageByCode(code)
        },
        {
            status: code
        }
    );
}

const httpErrorCodes = Object.entries(HttpErrorCode);

function getErrorMessageByCode(code: HttpErrorEntry) {
    const entry = httpErrorCodes.find(([, val]) => (val as number) === (code as number))!;
    return HttpErrorMessage[entry[0] as keyof typeof HttpErrorMessage];
}

function parseZodError(error: ZodError) {
    const errors: string[] = [];

    const formatSchemaPath = (path: (string | number)[]) => {
        return !path.length ? "Schema" : path.join(".");
    };

    const firstLetterToLowerCase = (str: string) => {
        return str.charAt(0).toLowerCase() + str.slice(1);
    };

    const makeSureItsString = (value: unknown) => {
        return typeof value === "string" ? value : JSON.stringify(value);
    };

    const parseZodIssue = (issue: ZodIssue) => {
        switch (issue.code) {
            case "invalid_type": return `${formatSchemaPath(issue.path)} must be a ${issue.expected}`;
            case "invalid_literal": return `${formatSchemaPath(issue.path)} must be a ${makeSureItsString(issue.expected)}`;
            case "custom": return `${formatSchemaPath(issue.path)}: ${firstLetterToLowerCase(issue.message)}`;
            case "invalid_union": return `${formatSchemaPath(issue.path)} ${firstLetterToLowerCase(issue.message)}`;
            case "invalid_union_discriminator": return `${formatSchemaPath(issue.path)} ${firstLetterToLowerCase(issue.message)}`;
            case "invalid_enum_value": return `${formatSchemaPath(issue.path)} ${firstLetterToLowerCase(issue.message)}`;
            case "unrecognized_keys": return `${formatSchemaPath(issue.path)} ${firstLetterToLowerCase(issue.message)}`;
            case "invalid_arguments": return `${formatSchemaPath(issue.path)} ${firstLetterToLowerCase(issue.message)}`;
            case "invalid_return_type": return `${formatSchemaPath(issue.path)} ${firstLetterToLowerCase(issue.message)}`;
            case "invalid_date": return `${formatSchemaPath(issue.path)} ${firstLetterToLowerCase(issue.message)}`;
            case "invalid_string": return `${formatSchemaPath(issue.path)} ${firstLetterToLowerCase(issue.message)}`;
            case "too_small": return `${formatSchemaPath(issue.path)} ${firstLetterToLowerCase(issue.message)}`;
            case "too_big": return `${formatSchemaPath(issue.path)} ${firstLetterToLowerCase(issue.message)}`;
            case "invalid_intersection_types": return `${formatSchemaPath(issue.path)} ${firstLetterToLowerCase(issue.message)}`;
            case "not_multiple_of": return `${formatSchemaPath(issue.path)} ${firstLetterToLowerCase(issue.message)}`;
            case "not_finite": return `${formatSchemaPath(issue.path)} ${firstLetterToLowerCase(issue.message)}`;
            default: return `Schema has an unknown error (JSON: ${JSON.stringify(issue)})`;
        }
    };

    for (const issue of error.issues) {
        const parsedIssue = `${parseZodIssue(issue)}.`;
        if (parsedIssue) errors.push(parsedIssue);
    }

    return errors
        .join(" ")
        .replace(/^[\s\n]+|[\s\n]+$/g, "")
        .trim();
}