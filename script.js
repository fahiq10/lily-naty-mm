```javascript
// ==================================================
// LILY NATY MM ACCOUNTS
// GOOGLE SHEETS + SELL ACCOUNT + WHATSAPP
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

    id: String(
      getValue(row, ["ID"])
    ),

    title:
      getValue(row, ["Title"]) ||
      "Free Fire Account",

    game:
      getValue(row, ["Game"]) ||
      "Free Fire",

    price:
      Number(
        getValue(row, ["Price"])
      ) || 0,

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
        getValue(
          row,
          ["rare outfits"]
        ) ||
        "Not specified",

      gunSkins:
        getValue(
          row,
          ["gunskins", "gun skins"]
        ) ||
        "Not specified",

      emotes:
        getValue(row, ["emotes"]) ||
        "Not specified",

      evoGuns:
        getValue(
          row,
          ["evo guns"]
        ) ||
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

    const response =
      await fetch(
        GOOGLE_SHEET_API +
        "?t=" +
        Date.now()
      );

    if (!response.ok) {

      throw new Error(
        "Google Sheet returned " +
        response.status
      );

    }

    const data =
      await response.json();

    if (!Array.isArray(data)) {

      throw new Error(
        "Google Sheet did not return an array."
      );

    }

    accounts =
      data.map(convertAccount);

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

  const message =
    encodeURIComponent(
      `Hello LILY NATY, I'm interested in Free Fire Account #${account.id} - ${naira(account.price)}. Is it still available?`
    );

  return (
    `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`
  );

}

// ==================================================
// RENDER ACCOUNTS
// ==================================================

function render() {

  if (!grid || !search) {
    return;
  }

  const q =
    search.value
      .trim()
      .toLowerCase();

  const filtered =
    accounts.filter(
      function (account) {

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

      }
    );

  grid.innerHTML =
    filtered.map(
      function (account) {

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
                  onclick="openDetails('${account.id}')"
                >
                  View Details
                </button>

              </div>

            </div>

          </article>

        `;

      }
    )
    .join("");

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
    accounts.find(
      function (item) {

        return item.id === String(id);

      }
    );

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
    document.getElementById(
      "modalStatus"
    );

  const modalWhatsApp =
    document.getElementById(
      "modalWhatsApp"
    );

  const modal =
    document.getElementById("modal");

  if (modalImg) {

    modalImg.src =
      account.image;

  }

  if (modalTitle) {

    modalTitle.textContent =
      `${account.title} #${account.id}`;

  }

  if (modalPrice) {

    modalPrice.textContent =
      naira(account.price);

  }

  const detailsText = `

Rank: ${account.details.rank}

Rare Outfits: ${account.details.rareOutfits}

Gun Skins: ${account.details.gunSkins}

Emotes: ${account.details.emotes}

Evo Guns: ${account.details.evoGuns}

${account.description}

`.trim();

  if (modalDescription) {

    modalDescription.textContent =
      detailsText;

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
        : "inline-block";

  }

  if (modal) {

    modal.classList.add("open");

  }

}

// ==================================================
// FILTER BUTTONS
// ==================================================

document
  .querySelectorAll(".filter")
  .forEach(
    function (button) {

      button.addEventListener(
        "click",
        function () {

          document
            .querySelectorAll(".filter")
            .forEach(
              function (btn) {

                btn.classList.remove(
                  "active"
                );

              }
            );

          button.classList.add(
            "active"
          );

          activeFilter =
            button.dataset.filter;

          render();

        }
      );

    }
  );

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
          .classList.remove(
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
  .forEach(
    function (element) {

      element.href =
        `https://wa.me/${WHATSAPP_NUMBER}?text=${
          encodeURIComponent(
            "Hello LILY NATY, I want to ask about the available Free Fire accounts."
          )
        }`;

    }
  );

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

      // STOP THE PAGE FROM REFRESHING/JUMPING
      event.preventDefault();
      event.stopPropagation();

      // ==========================================
      // GET SELLER INFORMATION
      // ==========================================

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

      const screenshot =
        screenshotInput?.files?.[0] || null;

      // ==========================================
      // CHECK SCREENSHOT
      // ==========================================

      if (!screenshot) {

        alert(
          "Please choose your Free Fire account screenshot first."
        );

        if (screenshotInput) {

          screenshotInput.focus();

        }

        return;

      }

      // ==========================================
      // CHECK REQUIRED INFORMATION
      // ==========================================

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

      // ==========================================
      // FORMAT PRICE
      // ==========================================

      const formattedPrice =
        Number(
          accountPrice
        ).toLocaleString(
          "en-NG"
        );

      // ==========================================
      // CREATE WHATSAPP MESSAGE
      // ==========================================

      const message =

`🔥 LILY NATY SELL ACCOUNT REQUEST

━━━━━━━━━━━━━━━━━━

👤 Seller Name:
${sellerName}

🎮 Account Title:
${accountTitle}

🏆 Rank:
${accountRank}

💰 Asking Price:
₦${formattedPrice}

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

📸 Screenshot:
${screenshot.name}

━━━━━━━━━━━━━━━━━━

⚠️ IMPORTANT:
I have selected my account screenshot on the website.

Please attach the screenshot manually in this WhatsApp chat.

Please review my account for listing.

Thank you.`;

      // ==========================================
      // CREATE WHATSAPP URL
      // ==========================================

      const whatsappURL =
        `https://wa.me/${WHATSAPP_NUMBER}?text=${
          encodeURIComponent(
            message
          )
        }`;

      // ==========================================
      // SHOW SUCCESS MESSAGE
      // ==========================================

      const success =
        document.getElementById(
          "sellSuccess"
        );

      if (success) {

        success.style.display =
          "block";

        success.innerHTML = `
          <strong>✅ Request prepared!</strong><br>
          WhatsApp is opening now.<br>
          <small>
            Please attach the screenshot you selected
            after WhatsApp opens.
          </small>
        `;

      }

      // ==========================================
      // CHANGE BUTTON TEMPORARILY
      // ==========================================

      const submitButton =
        sellerForm.querySelector(
          ".sell-submit"
        );

      if (submitButton) {

        submitButton.disabled =
          true;

        submitButton.textContent =
          "Opening WhatsApp...";

      }

      // ==========================================
      // OPEN WHATSAPP
      // ==========================================

      // Try opening WhatsApp immediately.
      // Using location.href is more reliable than
      // window.open because browsers may block
      // popup windows.

      setTimeout(
        function () {

          window.location.href =
            whatsappURL;

        },
        100
      );

    }
  );

}

// ==================================================
// START WEBSITE
// ==================================================

loadAccounts();
```
