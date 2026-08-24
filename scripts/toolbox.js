import { page } from "./lib/page.js";

page("index", {
  out: ".",
  root: "./",
  title: "Toolbox",
  head: '<meta name="keywords" content="dragcave, dragons, 42" />',
});

console.log("/index.html: toolbox");
