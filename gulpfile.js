import { src, dest } from "gulp";
import rename from "gulp-rename";
import fs from "fs";
import path from "path";

function updateVersion() {
    const packagePath = "./package.json";
    const pkg = JSON.parse(fs.readFileSync(packagePath, "utf8"));
    const [major, minor, patch] = pkg.version.split(".");
    pkg.version = `${major}.${minor}.${parseInt(patch) + 1}`;
    fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 4));
    return pkg.version;
}

export default () => {
    const version = updateVersion();
    console.log(version);
    return src("./src/dimension.jsx")
        .pipe(
            rename((path) => {
                path.basename += `-${version}`;
            }),
        )
        .pipe(dest("./dist"));
};
