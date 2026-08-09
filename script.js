```javascript
// ==================================================
// LILY NATY MM ACCOUNTS
// GOOGLE SHEETS + SELL ACCOUNT
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
// GOOGLE SHEET HELPERS
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
      String(
        getValue(row, ["Status"]) ||
        "available"
      )
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
    if (grid) {
      grid.innerHTML = `
        <p style="color:#777;padding:20px;">
          Loading accounts...
        </p>
      `;
    }

    const response = await fetch(
      GOOGLE_SHEET_API + "?t=" + Date.now()
    );

    if (!response.ok) {
      throw new Error(
        "Google Sheet returned " +
        response.status
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

    if (grid) {
      grid.innerHTML = `
        <p style="color:#ff7777;padding:20px;">
          Unable to load accounts right now.
        </p>
      `;
    }
  }
}

// ==================================================
// ACCOUNT WHATSAPP LINK
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

  const filtered =
    accounts.filter(function (account) {

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
        !q ||
        searchText.includes(q);

      return filterOK && searchOK;
    });

  grid.innerHTML =
    filtered.map(function (account) {

      const isSold =
        account.status === "sold";

      return `
        <article
          class="${isSold ? "sold-account" : ""}"
        >

          <img
            src="${account.image}"
            alt="${account.title} #${account.id}"
            loading="lazy"
          >

          <div class="card-body">

            <div class="card-top">

              <span
                class="badge ${
                  isSold
                    ? "sold"
                    : "available"
                }"
              >
                ${
                  isSold
                    ? "SOLD"
                    : "AVAILABLE"
                }
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
                type="button"
                onclick="openDetails('${account.id}')"
              >
                View Details
              </button>

            </div>

          </div>

        </article>
      `;

    }).join("");

  if (empty) {
    empty.hidden =
      filtered.length !== 0;
  }
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

  const modalImg =
    document.getElementById("modalImg");

  const modalTitle =
    document.getElementById("modalTitle");

  const modalPrice =
    document.getElementById("modalPrice");

  const modalDescription =
    document.getElementById(
      "modalDescription"
    );

  const modalStatus =
    document.getElementById("modalStatus");

  const modalWhatsApp =
    document.getElementById(
      "modalWhatsApp"
    );

  if (modalImg) {
    modalImg.src = account.image;
  }

  if (modalTitle) {
    modalTitle.textContent =
      `${account.title} #${account.id}`;
  }

  if (modalPrice) {
    modalPrice.textContent =
      naira(account.price);
  }

  if (modalDescription) {
    modalDescription.textContent = `
Rank: ${account.details.rank}

Rare Outfits: ${account.details.rareOutfits}

Gun Skins: ${account.details.gunSkins}

Emotes: ${account.details.emotes}

Evo Guns: ${account.details.evoGuns}

${account.description}
`.trim();
  }

  const isSold =
    account.status === "sold";

  if (modalStatus) {
    modalStatus.textContent =
      isSold
        ? "SOLD"
        : "AVAILABLE";

    modalStatus.className =
      `badge ${
        isSold
          ? "sold"
          : "available"
      }`;
  }

  if (modalWhatsApp) {
    modalWhatsApp.href =
      waLink(account);

    modalWhatsApp.style.display =
      isSold
        ? "none"
        : "inline-flex";
  }

  const modal =
    document.getElementById("modal");

  if (modal) {
    modal.classList.add("open");
  }
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
            btn.classList.remove(
              "active"
            );
          });

        button.classList.add(
          "active"
        );

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

      const modal =
        document.getElementById(
          "modal"
        );

      if (modal) {
        modal.classList.remove(
          "open"
        );
      }

    }
  );
}

const modal =
  document.getElementById("modal");

if (modal) {
  modal.addEventListener(
    "click",
    function (event) {

      if (
        event.target.id === "modal"
      ) {
        modal.classList.remove(
          "open"
        );
      }

    }
  );
}

// ==================================================
// GENERAL WHATSAPP BUTTONS
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
// SELL ACCOUNT FORM
// ==================================================

const sellerForm =
  document.getElementById(
    "sellerForm"
  );

if (sellerForm) {

  sellerForm.addEventListener(
    "submit",
    function (event) {

      event.preventDefault();

      // ------------------------------------------
      // GET FORM VALUES
      // ------------------------------------------

      const sellerName =
        document.getElementById(
          "sellerName"
        )?.value.trim() || "";

      const accountTitle =
        document.getElementById(
          "accountTitle"
        )?.value.trim() || "";

      const accountRank =
        document.getElementById(
          "accountRank"
        )?.value.trim() || "";

      const accountPrice =
        document.getElementById(
          "accountPrice"
        )?.value.trim() || "";

      const rareOutfits =
        document.getElementById(
          "rareOutfits"
        )?.value.trim() || "";

      const gunskins =
        document.getElementById(
          "gunskins"
        )?.value.trim() || "";

      const emotes =
        document.getElementById(
          "emotes"
        )?.value.trim() || "";

      const evoGuns =
        document.getElementById(
          "evoGuns"
        )?.value.trim() || "";

      const description =
        document.getElementById(
          "accountDescription"
        )?.value.trim() || "";

      const screenshotInput =
        document.getElementById(
          "accountScreenshot"
        );

      // ------------------------------------------
      // CHECK SCREENSHOT
      // ------------------------------------------

      if (
        !screenshotInput ||
        !screenshotInput.files ||
        screenshotInput.files.length === 0
      ) {

        alert(
          "Please choose your account screenshot first."
        );

        screenshotInput?.focus();

        return;
      }

      const screenshot =
        screenshotInput.files[0];

      // ------------------------------------------
      // CHECK REQUIRED INFORMATION
      // ------------------------------------------

      if (
        !sellerName ||
        !accountTitle ||
        !accountRank ||
        !accountPrice ||
        !rareOutfits ||
        !gunskins ||
        !emotes ||
        !evoGuns ||
        !description
      ) {

        alert(
          "Please fill in all the account information before submitting."
        );

        return;
      }

      // ------------------------------------------
      // CREATE WHATSAPP MESSAGE
      // ------------------------------------------

      const message =
`🔥 LILY NATY SELL ACCOUNT REQUEST

👤 Seller Name:
${sellerName}

🎮 Account Title:
${accountTitle}

🏆 Rank:
${accountRank}

💰 Asking Price:
₦${Number(accountPrice).toLocaleString("en-NG")}

👕 Rare Outfits:
${rareOutfits}

🔫 Gun Skins:
${gunskins}

😀 Emotes:
${emotes}

⚡ Evo Guns:
${evoGuns}

📝 Description:
${description}

📸 SCREENSHOT:
${screenshot.name}

━━━━━━━━━━━━━━━━━━

Please review my Free Fire account.

I have selected the account screenshot on the website.

I will attach the screenshot to this WhatsApp chat after it opens.`;

      // ------------------------------------------
      // CREATE WHATSAPP URL
      // ------------------------------------------

      const whatsappURL =
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
          message
        )}`;

      // ------------------------------------------
      // SHOW SUCCESS MESSAGE IF AVAILABLE
      // ------------------------------------------

      const success =
        document.getElementById(
          "sellSuccess"
        );

      if (success) {

        success.style.display =
          "block";

        success.textContent =
          "Opening WhatsApp... Please attach your screenshot there.";
      }

      // ------------------------------------------
      // SAVE THE FORM TEMPORARILY
      // ------------------------------------------

      try {
        sessionStorage.setItem(
          "lilyNatySellerName",
          sellerName
        );

        sessionStorage.setItem(
          "lilyNatyScreenshotName",
          screenshot.name
        );
      } catch (error) {
        console.log(
          "Session storage unavailable."
        );
      }

      // ------------------------------------------
      // IMPORTANT:
      // USE CURRENT TAB INSTEAD OF window.open()
      // ------------------------------------------

      window.location.href =
        whatsappURL;

    }
  );

}

// ==================================================
// START WEBSITE
// ==================================================

loadAccounts();
```
