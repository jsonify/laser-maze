import react from "@vitejs/plugin-react";

/** @type {import('vitest').UserConfigExport} */
export default {
  plugins: [react()],
  test: {
    environment: "happy-dom",
    globals: true,
  },
};
