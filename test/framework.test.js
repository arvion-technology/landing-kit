import test from "node:test";
import assert from "node:assert/strict";
import {
  SECTIONS, REQUIRED_SECTIONS, TEMPLATES, validateTemplate, validateAll, coverage,
  omitted, getTemplate, templatePath, sectionName,
} from "../src/framework.js";
import { PALETTES } from "../src/palettes.js";

test("the framework documents eight ordered sections", () => {
  assert.equal(SECTIONS.length, 8);
  assert.deepEqual(REQUIRED_SECTIONS, ["hero", "proof", "problem", "product", "how", "pricing", "objections", "cta"]);
  for (const section of SECTIONS) {
    assert.ok(section.job.length > 60, `${section.id} job`);
    assert.ok(section.must.length >= 2, `${section.id} must-list`);
    assert.ok(section.mistake.length > 25, `${section.id} mistake`);
  }
});

test("there are exactly six templates with unique ids and verticals", () => {
  assert.equal(TEMPLATES.length, 6);
  assert.equal(new Set(TEMPLATES.map((t) => t.id)).size, 6);
  assert.equal(new Set(TEMPLATES.map((t) => t.vertical)).size, 6);
  const verticals = TEMPLATES.map((t) => t.vertical);
  for (const expected of ["SaaS", "Agency", "Mobile app", "AI product", "Marketplace", "Developer tool"]) {
    assert.ok(verticals.includes(expected), `missing ${expected}`);
  }
});

test("every template passes structural validation", () => {
  assert.deepEqual(validateAll(), []);
  for (const template of TEMPLATES) {
    assert.deepEqual(validateTemplate(template), [], template.id);
  }
});

test("every template starts with the hero and ends with the final call to action", () => {
  for (const template of TEMPLATES) {
    assert.equal(template.sections[0], "hero", template.id);
    assert.equal(template.sections.at(-1), "cta", template.id);
  }
});

test("every template argues through proof, product and objections", () => {
  for (const template of TEMPLATES) {
    for (const required of ["proof", "product", "objections"]) {
      assert.ok(template.sections.includes(required), `${template.id} is missing ${required}`);
    }
  }
});

test("every framework section is used by at least four of the six templates", () => {
  const rows = coverage();
  assert.equal(rows.length, 8);
  for (const row of rows) {
    assert.ok(row.usedBy.length >= 4, `${row.id} used by only ${row.usedBy.length}`);
  }
});

test("omitted sections are reported, not silently dropped", () => {
  const agency = getTemplate("agency");
  assert.deepEqual(omitted(agency), ["pricing"]);
  const marketplace = getTemplate("marketplace");
  assert.deepEqual(omitted(marketplace), ["problem"]);
});

test("validation rejects a template that skips the argument", () => {
  const broken = {
    ...getTemplate("saas"),
    id: "broken",
    sections: ["hero", "cta", "pricing-table"],
    palette: "nope",
  };
  const errors = validateTemplate(broken);
  assert.ok(errors.some((error) => error.includes('unknown section')));
  assert.ok(errors.some((error) => error.includes('only 3 sections')));
  assert.ok(errors.some((error) => error.includes('no proof section')));
  assert.ok(errors.some((error) => error.includes('no objections section')));
  assert.ok(errors.some((error) => error.includes('missing palette')));
});

test("template metadata points at a palette in the chosen mode", () => {
  for (const template of TEMPLATES) {
    assert.ok(PALETTES[template.palette], `${template.id} palette`);
    assert.ok(["light", "dark"].includes(template.mode), `${template.id} mode`);
    assert.ok(template.note.length > 80, `${template.id} note`);
    assert.ok(template.audience.length > 15, `${template.id} audience`);
    assert.ok(template.pitch.length > 25, `${template.id} pitch`);
    assert.equal(templatePath(template), `demo/templates/${template.id}.html`);
    assert.equal(template.file, `templates/${template.id}.html`);
  }
});

test("lookup helpers return what they say they return", () => {
  assert.equal(getTemplate("ai").name, "Vela");
  assert.equal(getTemplate("nope"), null);
  assert.equal(sectionName("proof"), "Proof");
  assert.equal(sectionName("unknown"), "unknown");
});
