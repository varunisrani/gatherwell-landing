import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const html = await readFile(new URL("../dist/index.html", import.meta.url), "utf8");
const memberUrl = "https://gatherwell-demo.vercel.app/member-login";
const pastorUrl = "https://gatherwell-demo.vercel.app/pastor-login";

test("all landing demo links use the green GatherWell deployment", () => {
  assert.equal((html.match(new RegExp(memberUrl, "g")) ?? []).length, 3);
  assert.equal((html.match(new RegExp(pastorUrl, "g")) ?? []).length, 2);
  assert.doesNotMatch(html, /gatherwell-community-refined\.varun-israni-2063303\.chatgpt\.site/);
  assert.doesNotMatch(html, /https:\/\/gatherwell\.vercel\.app/);
});
