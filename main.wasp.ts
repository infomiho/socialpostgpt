import { App, type ExtImport } from "wasp-config";

const app = new App("socialpostgpt", {
  title: "SocialPostGPT",
  wasp: {
    version: "^0.16.0",
  },
  head: [
    `<script defer data-domain="socialpostgpt.xyz" src="http://plausible.apps.twoducks.dev/js/script.js"></script>`,
  ],
});

app.client({
  rootComponent: { import: "App", from: "@src/App" },
});

app.server({
  envValidationSchema: { import: "serverEnvSchema", from: "@src/env" },
});

defineRoute("MainPage", "/", {
  importDefault: "MainPage",
  from: "@src/pages/MainPage",
});

defineRoute("ResultPage", "/:generationId", {
  importDefault: "ResultPage",
  from: "@src/pages/ResultPage",
});

app.action("submitPrompt", {
  fn: { import: "submitPrompt", from: "@src/generation" },
  entities: ["Generation"],
});

app.query("getResult", {
  fn: { import: "getResult", from: "@src/generation" },
  entities: ["Generation"],
});

app.query("getLatestResults", {
  fn: { import: "getLatestResults", from: "@src/generation" },
  entities: ["Generation"],
});

app.query("getNumberOfResults", {
  fn: { import: "getNumberOfResults", from: "@src/stats" },
  entities: ["Result"],
});

app.job("generateResult", {
  executor: "PgBoss",
  perform: {
    fn: { import: "generateResultJob", from: "@src/jobs" },
    executorOptions: {
      pgBoss: { retryLimit: 1 },
    },
  },
  entities: ["Generation"],
});

export default app;

function defineRoute(name: string, path: string, component: ExtImport) {
  const page = app.page(name, { component });
  app.route(name, { path, to: page });
}
