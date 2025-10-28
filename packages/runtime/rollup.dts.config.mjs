import dts from "rollup-plugin-dts";

export default {
  input: "build-types/index.d.ts",
  output: [{ file: "dist/disk.d.ts", format: "es" }],
  plugins: [dts()],
};
