const fsbx = require("fuse-box");
const FuseBox = fsbx.FuseBox;
const path = require("path");
const proxy = require("express-http-proxy");

const production = process.env.NODE_ENV === "production";

// Create FuseBox Instance
const config = {
  homeDir: "src/",
  sourceMaps: { project: true, vendor: false },
  tsConfig: "tsconfig.json",
  hash: false,
  cache: !production,
  plugins: [
    fsbx.TypeScriptHelpers(),
    fsbx.JSONPlugin(),
    fsbx.SVGPlugin(),
    fsbx.BabelPlugin(),
    fsbx.WebIndexPlugin({
      title: "Coffee",
      template: "src/index.html",
      path: "./"
    }),
    [
      /node_modules\/.*\.css$/,
      fsbx.CSSResourcePlugin({
        dist: "build/css",
        resolve: f => `/css/${f}`
      }),
      fsbx.CSSPlugin()
    ]
  ]
};

if (production) {
  const prodPlugins = [
    fsbx.EnvPlugin({
      NODE_ENV: "production"
    })
  ];
  config.plugins = config.plugins.concat(prodPlugins);
  (config.sourceMaps = false), (config.output = "./production/$name.js");
} else {
  const TypeCheckPlugin = require("fuse-box-typechecker").TypeCheckPlugin;
  config.plugins = config.plugins.concat([TypeCheckPlugin()]);
  config.sourceMaps = { project: true, vendor: false };
  config.output = "./build/$name.js";
}

const app = `> index.tsx `;
const vendor = `~ index.tsx`;

const fuse = FuseBox.init(config);
const appBundle = fuse.bundle("app").target("browser").instructions(app);
const vendorBundle = fuse
  .bundle("vendor")
  .target("browser")
  .instructions(vendor);

if (!production) {
  appBundle.watch().hmr();
  vendorBundle.watch().hmr();
  fuse.dev(
    {
      root: ["build"]
    },
    server => {
      const build = path.resolve("./build");
      const test = path.resolve("./test");
      const app = server.httpServer.app;
      app.get("/", (req, res) => {
        res.sendFile(path.join(build, "index.html"));
      });
      app.get("/edit/*", (req, res) => {
        res.sendFile(path.join(build, "index.html"));
      });
      app.get("/monitor", (req, res) => {
        res.sendFile(path.join(build, "index.html"));
      });
      app.get("/*.js", (req, res) => {
        res.sendFile(path.join(build, req.path));
      });
      app.get("/*.js.map", (req, res) => {
        res.sendFile(path.join(build, req.path));
      });
      app.get("/api/cookbooks", (req, res) => {
        res.sendFile(path.join(test, "cookbooks.json"));
      });
      app.get("/api/cookbooks/*", (req, res) => {
        res.sendFile(path.join(test, "cookbook.json"));
      });
      // app.get("/api/heater", (req, res) => {
      // res.header("Cache-Control", "no-cache, no-store, must-revalidate");
      // res.header("Pragma", "no-cache");
      // res.header("Expires", 0);
      // res.send({
      // statusCode: 200,
      // message: "Get heater status successfully",
      // data: {
      // temperature: 88,
      // duty_cycle: 100,
      // output_temperature: 40,
      // set_point: 20
      // }
      // });
      // });
      // app.post("/api/heater", (req, res) => {
      // res.send({
      // statusCode: 200,
      // message: "Set heater status successfully",
      // data: {
      // temperature: 88,
      // duty_cycle: 100,
      // output_temperature: 40,
      // set_point: 20
      // }
      // });
      // });
      app.use(
        "/api/*",
        proxy("192.168.0.26", {
          proxyReqPathResolver: function(req, res) {
            const path = require("url").parse(req.baseUrl).path;
            return path;
          }
        })
      );
      app.use("*", (req, res) => {
        res.status(404).send("");
      });
    }
  );
  // fuse.dev({
  // root: 'build',
  // port: 4444
  // });
}

fuse.run();
