import { src, dest } from "gulp";

export default () => {
    return src("./src/dimension.jsx").pipe(dest("dist"));
};
