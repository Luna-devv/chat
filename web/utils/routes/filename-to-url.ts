export function getUrlFromFilename(filename: string) {
    let path = "";

    for (const param of filename.split("api")[1].slice(1).replace(/(\\|\/\/)/g, "/").split("/")) {
        if (/\[[a-z\-]{0,}\]/i.exec(param)) path += `/:${param.split("[")[1].split("]")[0]}`;
        else path += `/${param}`;
    }

    return path.replace(/\/(route)?\.tsx?$/, "").slice(1);
}