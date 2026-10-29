const form = document.querySelector("#card-form");
const nameInput = document.querySelector("#name-input");
const jobInput = document.querySelector("#job-input");
const emailInput = document.querySelector("#email-input");
const bioInput = document.querySelector("#bio-input");
const card = document.querySelector("#card");
const cardName = document.querySelector("#card-name");
const cardJob = document.querySelector("#card-job");
const cardEmail = document.querySelector("#card-email");
const cardBio = document.querySelector("#card-bio");
const avatar = document.querySelector("#avatar");
const counter = document.querySelector(".counter");
const bioLeft = document.querySelector("#bio-left");
const color = document.querySelector("#color-select");
const dark = document.querySelector("#theme-btn");
const reset = document.querySelector("#reset-btn");
form.addEventListener("input", function() {
    const name = nameInput.value.trim();
    const job = jobInput.value.trim();
    const email = emailInput.value.trim();
    const bio = bioInput.value.trim();
    let counterBio = 80 - bio.length;


    cardName.textContent = name || "Your name";
    avatar.textContent = name ? name[0].toUpperCase() : "?";
    cardJob.textContent = job || "Your job title";
    cardEmail.textContent = email || "your@email.com";
    cardBio.textContent = bio || "Your bio will appear here.";
    bioLeft.textContent = `${counterBio}`;
    counter.classList.toggle("warning", counterBio <= 10);
});
color.addEventListener("change", function() {
    let inputColor = color.value;
    card.style.borderColor = inputColor;
    avatar.style.backgroundColor = inputColor;

});
dark.addEventListener("click", function() {
    document.body.classList.toggle("dark");
    if (document.body.classList.contains("dark")) {
        dark.textContent = "Light mode"
    } else {
        dark.textContent = "Dark mode"
    }
});
reset.addEventListener("click", function() {
    form.reset();
    cardName.textContent = "Your name";
    cardJob.textContent = "Your job title";
    cardEmail.textContent = "your@email.com";
    cardBio.textContent = "Your bio will appear here.";

    avatar.textContent = "?";
    bioLeft.textContent = "80";
    counter.classList.remove("warning");

    color.value = "#4f46e5";
    card.style.borderColor = "#4f46e5";
    avatar.style.backgroundColor = "#4f46e5";
});