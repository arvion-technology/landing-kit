# The copy framework

Every template in Landing Kit is one argument in the same order. The visual
language changes per vertical; the order does not, because the order is the part
that decides whether a stranger keeps reading.

This document explains each section, what it has to do, the copy rules we use
when filling it, and where each of the six templates bends the framework.

## The order and why it is this order

A visitor arrives with three questions, in sequence:

1. *Is this for me?*: answered by the hero and the audience named in it.
2. *Is it real?*: answered by proof, then by the product section.
3. *What will it cost me to try?*: answered by pricing and objections.

If a section answers a question the reader is not asking yet, it is in the wrong
place. That is why the final call to action comes after the objections, not
before them.

## 1. Hero

**Job.** State the outcome, name the audience, give one action. The visitor
decides whether to scroll in about five seconds.

**Rules.**
- One specific promise. "Close the month without a spreadsheet relay race" beats
  "modern finance operations".
- The primary button is a verb. The secondary path is for people who are not
  ready and should be quieter.
- The visual should show the product surface, not an illustration of teamwork.

**Mistake.** Feature lists and three competing buttons. If everything is
emphasised, nothing is.

**In the six templates.** Ledgerline leads with the close; Fieldnote leads with
the studio's position; Tempo leads with the emotional benefit and immediately
follows with the mechanism; Vela leads with the citation; Swap names both sides
of the marketplace; Relay leads with the exact failing moment.

## 2. Proof

**Job.** Answer "is this real?" without paid logos or invented numbers.

**Rules.**
- Show a mechanism the reader can verify in a trial: a citation, a held payment,
  an engagement model, a retention policy.
- Never invent a customer count, a testimonial or a logo wall. If you do not have
  permission to show client work, show how the work is run.
- Place it before the first long scroll.

**Mistake.** Logos of companies that are not customers, or a metric with no
source.

**In the six templates.** Agency's proof is the engagement model. AI's proof is
the citation policy. Marketplace's proof is the escrow flow. Developer tool's
proof is retention and redaction. SaaS's proof is three audit mechanics. App's
proof is three observable behaviours.

## 3. Problem

**Job.** Describe the current workaround precisely enough that the reader
recognises their own week. Agitate the cost, not the competitor.

**Rules.**
- Name a concrete failure: "exports that disagree", not "inefficiency".
- The enemy is the status quo. Competitor-bashing asks the reader to know a
  market they may not care about.
- Keep it short. Three paragraphs is enough to earn the product section.

**Mistake.** Generic pain that could describe any company in the category.

**In the six templates.** SaaS names the spreadsheet relay race; Agency names the
gap between decision and interface; AI names the four-tool research loop;
Developer tool names the 2am payload hunt. App and Marketplace skip this section:
both audiences already know the problem, so the page goes straight to the
mechanism.

## 4. Product

**Job.** Show the product doing the thing the hero promised. Three or four
capabilities, each tied to a problem.

**Rules.**
- Benefit first, feature name second.
- Use the real interface or a faithful mock. If the mock cannot be built with
  HTML and CSS, the claim is probably too abstract.
- Four items maximum. The fifth is for the pricing page.

**Mistake.** A feature grid that could belong to any product in the category.

**In the six templates.** Every template uses a different artefact: dashboard
(Ledgerline), services (Fieldnote), app screen (Tempo), cited answer (Vela),
category feed (Swap), terminal (Relay).

## 5. How it works

**Job.** Remove the imagined setup cost. Three or four steps, in order.

**Rules.**
- The first step should be small enough to do today: connect one folder, pick
  four days, point one webhook at the tool.
- Say what the vendor does for the customer.
- End on the state after setup, not on "success".

**Mistake.** Five steps ending in a confetti animation, which explains nothing.

**In the six templates.** The developer tool makes the quickstart the section:
two commands, no prose tour. The marketplace splits buyer and seller flows in the
product section and keeps the how-to focused on the buyer.

## 6. Pricing

**Job.** Let the reader qualify themselves without a sales call.

**Rules.**
- Show a starting price or an honest range.
- Say what changes between tiers. Retention, documents indexed, workspace count.
  something the buyer can compare.
- Put the caveat where the price is: "Starter is not time-limited; it is the
  product with a shorter history window."

**Mistake.** "Contact us" for a product a freelancer could buy on a card.

**In the six templates.** Five templates show prices. Agency deliberately omits
pricing: a fixed-scope studio sells the engagement, and the honest next step is a
conversation about scope, not a plan grid. That omission is recorded in
`src/framework.js` and displayed in the gallery.

## 7. Objections

**Job.** Answer the three reasons people leave: price, switching cost and risk.
Answer them where the doubt happens.

**Rules.**
- Use the exact question the buyer asks, in their words.
- The answer should contain the limitation as well as the benefit. "It does not
  do X yet, because Y" is more convincing than a feature list.
- Three to five questions. More becomes a support site.

**Mistake.** Questions nobody asks, written to fill a grid.

**In the six templates.** Each template picks the three doubts specific to its
category: migration, access and lock-in for finance; data use, permissions and
hallucination for AI; safety, fees and delivery for a marketplace; retention and
self-hosting for a developer tool.

## 8. Final call to action

**Job.** Repeat the hero promise in fewer words and ask for the action again, now
that the objections are answered.

**Rules.**
- The same action as the hero. Do not introduce a new offer at the bottom.
- One line of risk reversal: no card, free during beta, no listing fee.
- Keep it shorter than the hero. The argument is already made.

**Mistake.** A new promise in the footer that resets the decision.

## How to write the copy without fake proof

The six templates are fictional products, and the sample copy avoids three
things that make landing pages untrustworthy:

1. **No invented traction.** There is no "10,000 teams" line, no logo wall and no
   testimonial. When the page needs proof, it shows a mechanism instead.
2. **No numbers the product cannot produce.** A mock dashboard shows sample
   figures because it is a product screenshot; the page itself never claims a
   growth rate or an uptime figure.
3. **No hidden limitation.** Each pricing section states one real caveat, and each
   objection section answers with the limit included.

If you rebrand a template for a real product, replace the sample names, prices
and domain, then check every claim against something the product can actually
show. The framework will not save copy that is dishonest.

## Files

- `src/framework.js`: section definitions, template configurations, validation.
- `src/palettes.js`: six palettes in two modes, plus the contrast audit.
- `demo/landing.css`: the single stylesheet and the palette blocks.
- `demo/templates/*.html`: the six pages. Each section starts with a comment
  naming its purpose.
- `demo/index.html`: the gallery, framework table and rebrand guide.
