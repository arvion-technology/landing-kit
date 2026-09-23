import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { TEMPLATES, SECTIONS } from "../src/framework.js";
import { PALETTES, PALETTE_TOKENS } from "../src/palettes.js";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const fileUrl = (path) => new URL(`../${path}`, import.meta.url);

test("all six template files exist and carry real markup", () => {
  for (const template of TEMPLATES) {
    assert.ok(existsSync(fileUrl(templatePathOf(template))), `${template.id} file missing`);
    const html = read(templatePathOf(template));
    assert.ok(html.length > 7000, `${template.id} is only ${html.length} bytes`);
    assert.ok(html.trimEnd().endsWith("</html>"), `${template.id} is truncated`);
  }
});

function templatePathOf(template) {
  return `demo/${template.file}`;
}

test("each template marks every section its config declares", () => {
  for (const template of TEMPLATES) {
    const html = read(templatePathOf(template));
    assert.match(html, new RegExp(`<body data-template="${template.id}">`), template.id);
    for (const section of template.sections) {
      assert.ok(html.includes(`data-section="${section}"`), `${template.id} is missing data-section="${section}"`);
    }
    const markCount = (html.match(/data-section="/g) || []).length;
    assert.equal(markCount, template.sections.length, `${template.id} has ${markCount} sections`);
  }
});

test("each template is a complete standalone page", () => {
  for (const template of TEMPLATES) {
    const html = read(templatePathOf(template));
    assert.match(html, /<html lang="en" data-theme="(light|dark)">/);
    assert.match(html, /<meta name="viewport" content="width=device-width, initial-scale=1" \/>/);
    assert.match(html, /<title>[^<]{20,}<\/title>/);
    assert.match(html, /<meta name="description" content="[^"]{40,}" \/>/);
    assert.match(html, /<h1[^>]*>[^<]{10,}<\/h1>/);
    assert.match(html, /href="\.\.\/landing\.css"/);
    assert.match(html, /src="\.\.\/landing\.js"/);
    assert.match(html, /data-theme-toggle/);
    assert.match(html, /<footer class="lk-footer">/);
    assert.ok(html.includes("data-year"), `${template.id} has no computed year`);
  }
});

test("templates reference no remote scripts, styles or images", () => {
  for (const template of TEMPLATES) {
    const html = read(templatePathOf(template));
    assert.ok(!/(?:src|href)="https?:\/\//.test(html) || !/<(?:script|link|img)[^>]+https?:\/\//.test(html), `${template.id} loads a remote asset`);
    assert.ok(!/<script[^>]+src="(?:https?:)?\/\//.test(html), `${template.id} loads a remote script`);
    assert.ok(!/<link[^>]+href="(?:https?:)?\/\//.test(html), `${template.id} loads a remote stylesheet`);
    assert.ok(!/url\(\s*['"]?https?:/.test(html), `${template.id} embeds a remote background`);
  }
});

test("templates ship no placeholders and no fabricated social proof", () => {
  for (const template of TEMPLATES) {
    // Copy-rationale comments mention the anti-patterns by name; check what ships.
    const html = read(templatePathOf(template)).replace(/<!--[\s\S]*?-->/g, "");
    assert.ok(!/\{\{|TODO|Lorem ipsum|BUILD:/i.test(html), `${template.id} contains a placeholder`);
    assert.ok(!/trusted by|testimonial|logo wall|award-winning|as seen in|customers love/i.test(html), `${template.id} contains fake proof`);
    assert.ok(!/\b\d{1,3}(,\d{3})+\s+(customers|users|companies)\b/i.test(html), `${template.id} invents a customer count`);
  }
});

test("the shared stylesheet defines both modes for every template", () => {
  const css = read("demo/landing.css");
  for (const template of TEMPLATES) {
    assert.ok(css.includes(`body[data-template="${template.id}"]`), `${template.id} light palette`);
    assert.ok(css.includes(`html[data-theme="dark"] body[data-template="${template.id}"]`), `${template.id} dark palette`);
  }
});

test("every palette value appears verbatim in the stylesheet", () => {
  const css = read("demo/landing.css");
  for (const [id, palette] of Object.entries(PALETTES)) {
    for (const mode of ["light", "dark"]) {
      for (const token of PALETTE_TOKENS) {
        const value = palette[mode][token];
        assert.ok(css.includes(value), `${id}/${mode}/${token} value ${value} is missing from landing.css`);
      }
    }
  }
});

test("the stylesheet is responsive and reduced-motion aware", () => {
  const css = read("demo/landing.css");
  assert.ok(css.includes("@media (max-width: 820px)"), "no tablet breakpoint");
  assert.ok(css.includes("@media (max-width: 520px)"), "no small-phone breakpoint");
  assert.ok(css.includes("@media (prefers-reduced-motion: reduce)"), "no reduced-motion fallback");
  assert.ok(!/min-width:\s*3[6-9]\dpx/.test(css), "a 360px viewport would overflow");
});

test("the gallery index is wired and links all six previews through app.js", () => {
  const html = read("demo/index.html");
  assert.match(html, /href="arvion\.css"/);
  assert.match(html, /src="arvion\.js"/);
  assert.match(html, /src="app\.js"/);
  assert.match(html, /demo-banner/);
  assert.match(html, /id="template-grid"/);
  assert.match(html, /id="framework-body"/);
  assert.match(html, /#\/view\/agency/);
  const app = read("demo/app.js");
  assert.match(app, /TEMPLATES/);
  assert.match(app, /templates\/\$\{template\.id\}\.html/);
  assert.match(app, /previewSrc/);
});

test("the copy framework document covers every section and every template", () => {
  const doc = read("docs/copy-framework.md");
  assert.ok(doc.length > 2500, "copy framework is too thin");
  for (const section of SECTIONS) {
    assert.ok(doc.toLowerCase().includes(section.name.toLowerCase()), `missing section ${section.name}`);
  }
  for (const template of TEMPLATES) {
    assert.ok(doc.includes(template.name), `missing template ${template.name}`);
  }
  assert.ok(!/TODO|Lorem ipsum/i.test(doc), "copy framework contains a placeholder");
});
