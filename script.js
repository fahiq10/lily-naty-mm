// ==================================================
// LILY NATY MM ACCOUNTS
// GOOGLE SHEETS VERSION
// ==================================================

const WHATSAPP_NUMBER = "2349122602735";

const GOOGLE_SHEET_API =
  "https://script.google.com/macros/s/AKfycbwHnvjNUOBQm25wi6SYrwbnjlyT8R9fJjcWrBdnREqKzZ7Y_LOs1BBcISAG9jgOUn4Xdg/exec";

// ==================================================
// WEBSITE ELEMENTS
// ==================================================

const grid = document.getElementById("accountGrid");
const search = document.getElementById("search");
const empty = document.getElementById("empty");

let accounts = [];
let activeFilter = "all";

// ==================================================
// NAIRA FORMAT
// ==================================================

function naira(number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0
  }).format(Number(number) || 0);
}

// ==================================================
// CLEAN GOOGLE SHEET DATA
// ==================================================

function cleanKey(key) {
  return String(key || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "");
}

function getValue(row, possibleNames) {
  const keys = Object.keys(row);

  for (const wanted of possibleNames) {
    const wantedClean = cleanKey(wanted);

    const foundKey = keys.find(function (key) {
      return cleanKey(key) === wantedClean;
    });

    if (foundKey !== undefined) {
      return row[foundKey];
    }
  }

  return "";
}

// ==================================================
// CONVERT GOOGLE SHEET ROW
// ==================================================

function convertAccount(row) {
  return {
    id: String(getValue(row, ["ID"])),

    title:
      getValue(row, ["Title"]) ||
      "Free Fire Account",

    game:
      getValue(row, ["Game"]) ||
      "Free Fire",

    price:
      Number(getValue(row, ["Price"])) || 0,

    status:
      String(getValue(row, ["Status"]) || "available")
        .trim()
        .toLowerCase(),

    image:
      getValue(row, ["Image"]) || "",

    description:
      getValue(row, ["Description"]) ||
      "Free Fire account.",

    details: {
      rank:
        getValue(row, ["Rank"]) ||
        "Not specified",

      rareOutfits:
        getValue(row, ["rare outfits"]) ||
        "Not specified",

      gunSkins:
        getValue(row, ["gunskins", "gun skins"]) ||
        "Not specified",

      emotes:
        getValue(row, ["emotes"]) ||
        "Not specified",

      evoGuns:
        getValue(row, ["evo guns"]) ||
        "Not specified"
    }
  };
}

// ==================================================
// LOAD ACCOUNTS
// ==================================================

async function loadAccounts() {
  try {
    grid.innerHTML = `
      <p style="color:#777;padding:20px;">
        Loading accounts...
      </p>
    `;

    const response = await fetch(
      GOOGLE_SHEET_API + "?t=" + Date.now()
    );

    if (!response.ok) {
      throw new Error(
        "Google Sheet returned " + response.status
      );
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error(
        "Google Sheet did not return an array."
      );
    }

    accounts = data.map(convertAccount);

    console.log(
      "LILY NATY accounts loaded:",
      accounts
    );

    render();

  } catch (error) {
    console.error(
      "Account loading error:",
      error
    );

    grid.innerHTML = `
      <p style="color:#ff7777;padding:20px;">
        Unable to load accounts right now.
      </p>
    `;
  }
}

// ==================================================
// WHATSAPP
// ==================================================

function waLink(account) {
  const message = encodeURIComponent(
    `Hello LILY NATY, I'm interested in Free Fire Account #${account.id} - ${naira(account.price)}. Is it still available?`
  );

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
}

// ==================================================
// RENDER ACCOUNTS
// ==================================================

function render() {
  if (!grid || !search) {
    return;
  }

  const q =
    search.value.trim().toLowerCase();

  const filtered = accounts.filter(function (account) {

    // ==============================================
    // FILTER SYSTEM
    // ==============================================

    const filterOK =
      activeFilter === "all" ||
      account.status === activeFilter;

    const searchText = `
      ${account.title}
      ${account.game}
      ${account.id}
      ${account.details.rank}
    `.toLowerCase();

    const searchOK =
      !q || searchText.includes(q);

    return filterOK && searchOK;
  });

  grid.innerHTML =
    filtered.map(function (account) {

      const isSold =
        account.status === "sold";

      return `
        <article class="${isSold ? "sold-account" : ""}">

          <img
            src="${account.image}"
            alt="${account.title} #${account.id}"
            loading="lazy"
          >

          <div class="card-body">

            <div class="card-top">

              <span class="badge ${isSold ? "sold" : "available"}">
                ${isSold ? "SOLD" : "AVAILABLE"}
              </span>

              <small>
                #${account.id}
              </small>

            </div>

            <h3>
              ${account.title}
            </h3>

            <p>
              ${account.description}
            </p>

            <div class="price">
              ${naira(account.price)}
            </div>

            <div class="card-actions">

              <button
                onclick="openDetails('${account.id}')"
              >
                View Details
              </button>

            </div>

          </div>

        </article>
      `;

    }).join("");

  empty.hidden =
    filtered.length !== 0;
}

// ==================================================
// ACCOUNT DETAILS
// ==================================================

function openDetails(id) {

  const account =
    accounts.find(function (item) {
      return item.id === String(id);
    });

  if (!account) {
    return;
  }

  document.getElementById(
    "modalImg"
  ).src = account.image;

  document.getElementById(
    "modalTitle"
  ).textContent =
    `${account.title} #${account.id}`;

  document.getElementById(
    "modalPrice"
  ).textContent =
    naira(account.price);

  const detailsText = `
Rank: ${account.details.rank}

Rare Outfits: ${account.details.rareOutfits}

Gun Skins: ${account.details.gunSkins}

Emotes: ${account.details.emotes}

Evo Guns: ${account.details.evoGuns}

${account.description}
  `.trim();

  document.getElementById(
    "modalDescription"
  ).textContent =
    detailsText;

  const status =
    document.getElementById(
      "modalStatus"
    );

  const isSold =
    account.status === "sold";

  status.textContent =
    isSold ? "SOLD" : "AVAILABLE";

  status.className =
    `badge ${isSold ? "sold" : "available"}`;

  const wa =
    document.getElementById(
      "modalWhatsApp"
    );

  wa.href =
    waLink(account);

  // Don't allow WhatsApp purchase button
  // for sold accounts
  wa.style.display =
    isSold
      ? "none"
      : "inline-block";

  document
    .getElementById("modal")
    .classList.add("open");
}

// ==================================================
// FILTER BUTTONS
// ==================================================

document
  .querySelectorAll(".filter")
  .forEach(function (button) {

    button.addEventListener(
      "click",
      function () {

        document
          .querySelectorAll(".filter")
          .forEach(function (btn) {
            btn.classList.remove("active");
          });

        button.classList.add("active");

        activeFilter =
          button.dataset.filter;

        render();
      }
    );

  });

// ==================================================
// SEARCH
// ==================================================

if (search) {
  search.addEventListener(
    "input",
    render
  );
}

// ==================================================
// CLOSE MODAL
// ==================================================

const closeModal =
  document.getElementById(
    "closeModal"
  );

if (closeModal) {

  closeModal.addEventListener(
    "click",
    function () {

      document
        .getElementById("modal")
        .classList.remove("open");

    }
  );

}

const modal =
  document.getElementById(
    "modal"
  );

if (modal) {

  modal.addEventListener(
    "click",
    function (event) {

      if (
        event.target.id === "modal"
      ) {

        event.currentTarget
          .classList.remove("open");

      }

    }
  );

}

// ==================================================
// WHATSAPP BUTTONS
// ==================================================

document
  .querySelectorAll("[data-whatsapp]")
  .forEach(function (element) {

    element.href =
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        "Hello LILY NATY, I want to ask about the available Free Fire accounts."
      )}`;

  });

// ==================================================
// START WEBSITE
// ==================================================

loadAccounts();
