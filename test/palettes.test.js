import test from "node:test";
import assert from "node:assert/strict";
import {
  PALETTES, PALETTE_TOKENS, getPalette, paletteAudit, auditAllPalettes, paletteVariables, swatches,
} from "../src/palettes.js";
import { parseHex, ratio, grade, auditPair } from "../src/contrast.js";

test("six palettes, both modes, every token present", () => {
  assert.equal(Object.keys(PALETTES).length, 6);
  assert.equal(PALETTE_TOKENS.length, 8);
  for (const [id, palette] of Object.entries(PALETTES)) {
    for (const mode of ["light", "dark"]) {
      const colors = palette[mode];
      assert.ok(colors, `${id}.${mode}`);
      for (const token of PALETTE_TOKENS) {
        assert.ok(colors[token], `${id}.${mode}.${token} missing`);
        assert.match(colors[token], /^#[0-9a-f]{6}$/i, `${id}.${mode}.${token} is not a hex colour`);
      }
    }
  }
});

test("every palette token is a valid hex colour", () => {
  for (const [id, palette] of Object.entries(PALETTES)) {
    for (const mode of ["light", "dark"]) {
      for (const token of PALETTE_TOKENS) {
        assert.doesNotThrow(() => parseHex(palette[mode][token]), `${id}.${mode}.${token}`);
      }
    }
  }
});

test("all four promised pairs pass in all twelve palette variants", () => {
  const rows = auditAllPalettes();
  assert.equal(rows.length, 12);
  for (const row of rows) {
    assert.equal(row.total, 4);
    assert.equal(row.passing, 4, `${row.id}/${row.mode} worst: ${row.worst.label} ${row.worst.ratioText}`);
    assert.ok(row.worst.ratio >= 3);
  }
});

test("body and secondary text clear 4.5:1, not just 3:1", () => {
  for (const id of Object.keys(PALETTES)) {
    for (const mode of ["light", "dark"]) {
      const groups = paletteAudit(id, mode);
      assert.ok(groups[0].passes && groups[0].ratio >= 4.5, `${id}/${mode} body text ${groups[0].ratioText}`);
      assert.ok(groups[1].passes && groups[1].ratio >= 4.5, `${id}/${mode} secondary text ${groups[1].ratioText}`);
    }
  }
});

test("the action label is readable on the action colour", () => {
  for (const id of Object.keys(PALETTES)) {
    for (const mode of ["light", "dark"]) {
      const label = paletteAudit(id, mode)[2];
      assert.ok(label.ratio >= 4.5, `${id}/${mode} onAccent ${label.ratioText}`);
    }
  }
});

test("paletteVariables emits the --lk-* contract", () => {
  const vars = paletteVariables("ai", "dark");
  assert.equal(vars["--lk-bg"], "#070b14");
  assert.equal(vars["--lk-on-accent"], "#04101f");
  assert.equal(Object.keys(vars).length, PALETTE_TOKENS.length);
  assert.ok(!Object.keys(paletteVariables("app", "light")).some((key) => key.includes("Accent")));
});

test("getPalette rejects unknown ids and modes", () => {
  assert.equal(getPalette("devtool", "dark").accent, "#34d3b4");
  assert.throws(() => getPalette("nope"), /unknown palette/);
  assert.throws(() => getPalette("saas", "sepia"), /no sepia mode/);
});

test("swatches keep a stable token order for the gallery", () => {
  const list = swatches("marketplace", "light");
  assert.deepEqual(list.map((s) => s.token), PALETTE_TOKENS);
  assert.equal(list[0].value, PALETTES.marketplace.light.bg);
});

test("palette variants are actually distinct", () => {
  const accents = new Set();
  for (const id of Object.keys(PALETTES)) {
    accents.add(PALETTES[id].light.accent);
    accents.add(PALETTES[id].dark.accent);
  }
  assert.equal(accents.size, 12);
});

test("the contrast helper agrees with the WCAG anchor", () => {
  assert.ok(Math.abs(ratio("#000000", "#ffffff") - 21) < 0.001);
  assert.equal(grade(21), "AAA");
  assert.equal(grade(4.5), "AA");
  assert.equal(grade(3), "AA-large");
  assert.equal(grade(2.9), "FAIL");
  const pair = auditPair("test", "#000000", "#ffffff");
  assert.equal(pair.passes, true);
  assert.equal(pair.ratioText, "21.00:1");
});
