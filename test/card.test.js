const { test } = require("node:test");
const assert = require("node:assert/strict");
const { loadPage, normalizeColor } = require("./helpers");

const DEFAULTS = {
  "#card-name": "Your name",
  "#card-job": "Your job title",
  "#card-email": "your@email.com",
  "#card-bio": "Your bio will appear here.",
};

const text = (page, selector) => page.$(selector).textContent;

// ---------- Step 1: live text ----------

test("Step 1: typing a name shows it on the card", async () => {
  const page = await loadPage();
  page.type("#name-input", "Dana Levi");
  assert.equal(text(page, "#card-name"), "Dana Levi", "#card-name should show what was typed in #name-input");
});

test("Step 1: job, email and bio update the card", async () => {
  const page = await loadPage();
  page.type("#job-input", "Full Stack Student");
  page.type("#email-input", "dana@example.com");
  page.type("#bio-input", "I love JavaScript");
  assert.equal(text(page, "#card-job"), "Full Stack Student", "#card-job should show the job title");
  assert.equal(text(page, "#card-email"), "dana@example.com", "#card-email should show the email");
  assert.equal(text(page, "#card-bio"), "I love JavaScript", "#card-bio should show the bio");
});

test("Step 1: spaces at the start and end are removed (trim)", async () => {
  const page = await loadPage();
  page.type("#name-input", "   Dana   ");
  page.type("#job-input", "  Developer ");
  assert.equal(text(page, "#card-name"), "Dana", "the name on the card should be trimmed");
  assert.equal(text(page, "#card-job"), "Developer", "the job on the card should be trimmed");
});

test("Step 1: an empty field brings back the default text", async () => {
  const page = await loadPage();
  for (const [selector, input] of [
    ["#card-name", "#name-input"],
    ["#card-job", "#job-input"],
    ["#card-email", "#email-input"],
    ["#card-bio", "#bio-input"],
  ]) {
    page.type(input, "something");
    assert.equal(text(page, selector), "something", `typing in ${input} should update ${selector}`);
    page.type(input, "");
    assert.equal(text(page, selector), DEFAULTS[selector], `after clearing ${input}, ${selector} should show "${DEFAULTS[selector]}"`);
  }
});

test("Step 1: a field with only spaces counts as empty", async () => {
  const page = await loadPage();
  page.type("#name-input", "Dana");
  assert.equal(text(page, "#card-name"), "Dana", "typing a name should show it on the card");
  page.type("#name-input", "    ");
  assert.equal(text(page, "#card-name"), "Your name", "only spaces should show the default text");
});

// ---------- Step 2: avatar ----------

test("Step 2: the avatar shows the first letter of the name in uppercase", async () => {
  const page = await loadPage();
  page.type("#name-input", "dana");
  assert.equal(text(page, "#avatar"), "D", "the avatar for 'dana' should be D");
  page.type("#name-input", "Noa");
  assert.equal(text(page, "#avatar"), "N", "the avatar should update when the name changes");
});

test("Step 2: a name with spaces at the start (' dana') shows D", async () => {
  const page = await loadPage();
  page.type("#name-input", "  dana");
  assert.equal(text(page, "#avatar"), "D", "spaces at the start should be ignored");
});

test("Step 2: no name shows ?", async () => {
  const page = await loadPage();
  page.type("#name-input", "Dana");
  assert.equal(text(page, "#avatar"), "D", "the avatar for 'Dana' should be D");
  page.type("#name-input", "");
  assert.equal(text(page, "#avatar"), "?", "an empty name should show ? in the avatar");
  page.type("#name-input", "   ");
  assert.equal(text(page, "#avatar"), "?", "a name with only spaces should show ?");
});

// ---------- Step 3: counter ----------

test("Step 3: the counter shows how many characters are left out of 80", async () => {
  const page = await loadPage();
  page.type("#bio-input", "Hello");
  assert.equal(text(page, "#bio-left").trim(), "75", "after typing 5 characters, 75 should be left");
  page.type("#bio-input", "a".repeat(40));
  assert.equal(text(page, "#bio-left").trim(), "40", "after typing 40 characters, 40 should be left");
});

test("Step 3: 10 or fewer characters left adds the warning class", async () => {
  const page = await loadPage();
  const counter = page.$(".counter");
  page.type("#bio-input", "a".repeat(70));
  assert.ok(counter.classList.contains("warning"), "with 10 characters left .counter should have the class warning");
  page.type("#bio-input", "a".repeat(75));
  assert.ok(counter.classList.contains("warning"), "with 5 characters left .counter should have the class warning");
});

test("Step 3: more than 10 left removes the warning class", async () => {
  const page = await loadPage();
  const counter = page.$(".counter");
  page.type("#bio-input", "a".repeat(69));
  assert.ok(!counter.classList.contains("warning"), "with 11 characters left there should be no warning class");
  page.type("#bio-input", "a".repeat(72));
  assert.ok(counter.classList.contains("warning"), "with 8 characters left .counter should have the class warning");
  page.type("#bio-input", "a".repeat(20));
  assert.ok(!counter.classList.contains("warning"), "the warning class should be removed when the bio gets shorter");
});

// ---------- Step 4: color ----------

test("Step 4: choosing a color paints the card border and the avatar", async () => {
  const page = await loadPage();
  const red = normalizeColor(page.window, "#dc2626");
  page.choose("#color-select", "#dc2626");
  assert.equal(page.$("#card").style.borderColor, red, "the card border should be red");
  assert.equal(page.$("#avatar").style.backgroundColor, red, "the avatar background should be red");

  const green = normalizeColor(page.window, "#059669");
  page.choose("#color-select", "#059669");
  assert.equal(page.$("#card").style.borderColor, green, "the card border should change to green");
  assert.equal(page.$("#avatar").style.backgroundColor, green, "the avatar background should change to green");
});

// ---------- Step 5: dark mode ----------

test("Step 5: the theme button toggles the dark class on the body", async () => {
  const page = await loadPage();
  const body = page.document.body;
  page.click("#theme-btn");
  assert.ok(body.classList.contains("dark"), "after one click the body should have the class dark");
  page.click("#theme-btn");
  assert.ok(!body.classList.contains("dark"), "after a second click the class dark should be removed");
});

test("Step 5: the theme button text switches between Dark mode and Light mode", async () => {
  const page = await loadPage();
  const btn = page.$("#theme-btn");
  page.click(btn);
  assert.equal(btn.textContent.trim(), "Light mode", "in dark mode the button should say Light mode");
  page.click(btn);
  assert.equal(btn.textContent.trim(), "Dark mode", "in light mode the button should say Dark mode");
});

// ---------- Step 6: reset ----------

test("Step 6: reset clears all the fields", async () => {
  const page = await loadPage();
  page.type("#name-input", "Dana");
  page.type("#job-input", "Dev");
  page.type("#email-input", "d@d.com");
  page.type("#bio-input", "Hello");
  page.choose("#color-select", "#dc2626");
  page.click("#reset-btn");
  for (const input of ["#name-input", "#job-input", "#email-input", "#bio-input"]) {
    assert.equal(page.$(input).value, "", `${input} should be empty after reset`);
  }
  assert.equal(page.$("#color-select").value, "#4f46e5", "the color select should go back to Indigo");
});

test("Step 6: reset brings the card back to its starting state", async () => {
  const page = await loadPage();
  page.type("#name-input", "Dana");
  page.type("#job-input", "Dev");
  page.type("#email-input", "d@d.com");
  page.type("#bio-input", "a".repeat(75));
  assert.equal(text(page, "#card-name"), "Dana", "typing a name should show it on the card");
  assert.ok(page.$(".counter").classList.contains("warning"), "with 5 characters left .counter should have the class warning");
  page.click("#reset-btn");
  for (const [selector, value] of Object.entries(DEFAULTS)) {
    assert.equal(text(page, selector), value, `after reset ${selector} should show "${value}"`);
  }
  assert.equal(text(page, "#avatar"), "?", "after reset the avatar should show ?");
  assert.equal(text(page, "#bio-left").trim(), "80", "after reset the counter should show 80");
  assert.ok(!page.$(".counter").classList.contains("warning"), "after reset the warning class should be removed");
});

test("Step 6: reset brings back the default color (no letter left in the old color)", async () => {
  const page = await loadPage();
  const indigo = normalizeColor(page.window, "#4f46e5");
  page.type("#name-input", "Dana");
  page.choose("#color-select", "#dc2626");
  assert.equal(page.$("#avatar").style.backgroundColor, normalizeColor(page.window, "#dc2626"), "choosing Red should paint the avatar red");
  page.click("#reset-btn");
  const border = page.$("#card").style.borderColor;
  const avatarBg = page.$("#avatar").style.backgroundColor;
  assert.ok(border === "" || border === indigo, "after reset the card border should be the default color (Indigo)");
  assert.ok(avatarBg === "" || avatarBg === indigo, "after reset the avatar should be the default color (Indigo)");
});
