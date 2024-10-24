import { App } from "wasp-config";

const app = new App("socialpostgpt", {
  title: "SocialPostGPT",
  wasp: {
    version: "^0.15.1",
  },
  head: [
    `<script defer data-domain="socialpostgpt.xyz" src="http://plausible.apps.twoducks.dev/js/script.js"></script>`,
  ],
});

app.client({
  rootComponent: { import: "App", from: "@src/App" },
});

const mainPage = app.page("MainPage", {
  component: { importDefault: "MainPage", from: "@src/pages/MainPage" },
});
app.route("MainPage", { path: "/", to: mainPage });

const resultPage = app.page("ResultPage", {
  component: { importDefault: "ResultPage", from: "@src/pages/ResultPage" },
});
app.route("ResultPage", { path: "/:generationId", to: resultPage });

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
