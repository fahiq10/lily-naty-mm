// ==================================================
// LILY NATY MM ACCOUNTS
// GOOGLE SHEETS + WHATSAPP + LILY NATY AI
// ==================================================


// ==================================================
// SETTINGS
// ==================================================

const WHATSAPP_NUMBER = "2349122602735";

const GOOGLE_SHEET_API =
  "https://script.google.com/macros/s/AKfycbwHnvjNUOBQm25wi6SYrwbnjlyT8R9fJjcWrBdnREqKzZ7Y_LOs1BBcISAG9jgOUn4Xdg/exec";

// Your Cloudflare Worker
const AI_WORKER_URL =
  "https://lily-naty-ai.fahiqabiola.workers.dev";


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
      grid.innerHTML = "Loading accounts...";
    }

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

    if (grid) {
      grid.innerHTML =
        '<p style="color:#ff7777;padding:20px;">Unable to load accounts right now.</p>';
    }
  }
}


// ==================================================
// WHATSAPP BUY LINK
// ==================================================

function waLink(account) {
  const message =
    "Hello LILY NATY, I am interested in Free Fire Account #" +
    account.id +
    " - " +
    naira(account.price) +
    ". Is it still available?";

  return (
    "https://wa.me/" +
    WHATSAPP_NUMBER +
    "?text=" +
    encodeURIComponent(message)
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

  const filtered = accounts.filter(
    function (account) {
      const filterOK =
        activeFilter === "all" ||
        account.status === activeFilter;

      const searchText = (
        account.title +
        " " +
        account.game +
        " " +
        account.id +
        " " +
        account.details.rank
      ).toLowerCase();

      const searchOK =
        !q ||
        searchText.includes(q);

      return filterOK && searchOK;
    }
  );

  grid.innerHTML = filtered
    .map(function (account) {
      const isSold =
        account.status === "sold";

      return (
        '<article class="' +
        (isSold ? "sold-account" : "") +
        '">' +

        '<img ' +
        'src="' +
        account.image +
        '" ' +
        'alt="' +
        account.title +
        " #" +
        account.id +
        '" ' +
        'loading="lazy">' +

        '<div class="card-body">' +

        '<div class="card-top">' +

        '<span class="badge ' +
        (isSold ? "sold" : "available") +
        '">' +
        (isSold ? "SOLD" : "AVAILABLE") +
        "</span>" +

        "<small>#" +
        account.id +
        "</small>" +

        "</div>" +

        "<h3>" +
        account.title +
        "</h3>" +

        "<p>" +
        account.description +
        "</p>" +

        '<div class="price">' +
        naira(account.price) +
        "</div>" +

        '<div class="card-actions">' +

        '<button type="button" onclick="openDetails(\'' +
        account.id +
        "')\">" +
        "View Details" +
        "</button>" +

        "</div>" +

        "</div>" +

        "</article>"
      );
    })
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
    document.getElementById("modalDescription");

  const modalStatus =
    document.getElementById("modalStatus");

  const modalWhatsApp =
    document.getElementById("modalWhatsApp");

  const modal =
    document.getElementById("modal");

  if (modalImg) {
    modalImg.src =
      account.image;
  }

  if (modalTitle) {
    modalTitle.textContent =
      account.title +
      " #" +
      account.id;
  }

  if (modalPrice) {
    modalPrice.textContent =
      naira(account.price);
  }

  const detailsText =
    "Rank: " +
    account.details.rank +
    "\n\n" +

    "Rare Outfits: " +
    account.details.rareOutfits +
    "\n\n" +

    "Gun Skins: " +
    account.details.gunSkins +
    "\n\n" +

    "Emotes: " +
    account.details.emotes +
    "\n\n" +

    "Evo Guns: " +
    account.details.evoGuns +
    "\n\n" +

    account.description;

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
      "badge " +
      (isSold
        ? "sold"
        : "available");
  }

  if (modalWhatsApp) {
    modalWhatsApp.href =
      waLink(account);

    modalWhatsApp.style.display =
      isSold
        ? "none"
        : "inline-flex";
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
  document.getElementById(
    "modal"
  );

if (modal) {
  modal.addEventListener(
    "click",
    function (event) {

      if (
        event.target === modal
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

    const message =
      "Hello LILY NATY, I want to ask about the available Free Fire accounts.";

    element.href =
      "https://wa.me/" +
      WHATSAPP_NUMBER +
      "?text=" +
      encodeURIComponent(message);
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

      console.log(
        "SELL ACCOUNT FORM SUBMITTED"
      );

      const sellerName =
        document.getElementById(
          "sellerName"
        ).value.trim();

      const accountTitle =
        document.getElementById(
          "accountTitle"
        ).value.trim();

      const accountRank =
        document.getElementById(
          "accountRank"
        ).value.trim();

      const accountPrice =
        document.getElementById(
          "accountPrice"
        ).value.trim();

      const rareOutfits =
        document.getElementById(
          "rareOutfits"
        ).value.trim();

      const gunskins =
        document.getElementById(
          "gunskins"
        ).value.trim();

      const emotes =
        document.getElementById(
          "emotes"
        ).value.trim();

      const evoGuns =
        document.getElementById(
          "evoGuns"
        ).value.trim();

      const description =
        document.getElementById(
          "accountDescription"
        ).value.trim();

      const screenshotInput =
        document.getElementById(
          "accountScreenshot"
        );

      if (
        !screenshotInput ||
        !screenshotInput.files ||
        screenshotInput.files.length === 0
      ) {

        alert(
          "Please choose the account screenshot first."
        );

        return;
      }

      const screenshot =
        screenshotInput.files[0];

      const message =
        "SELL ACCOUNT REQUEST\n\n" +

        "Seller Name:\n" +
        sellerName +
        "\n\n" +

        "Account Title:\n" +
        accountTitle +
        "\n\n" +

        "Rank:\n" +
        accountRank +
        "\n\n" +

        "Asking Price:\n" +
        "₦" +
        Number(accountPrice).toLocaleString(
          "en-NG"
        ) +
        "\n\n" +

        "Rare Outfits:\n" +
        rareOutfits +
        "\n\n" +

        "Gun Skins:\n" +
        gunskins +
        "\n\n" +

        "Emotes:\n" +
        emotes +
        "\n\n" +

        "Evo Guns:\n" +
        evoGuns +
        "\n\n" +

        "Description:\n" +
        description +
        "\n\n" +

        "Screenshot selected:\n" +
        screenshot.name +
        "\n\n" +

        "I have selected the account screenshot. " +
        "I will attach it to this WhatsApp message.\n\n" +

        "Please review my account.";

      const whatsappURL =
        "https://wa.me/" +
        WHATSAPP_NUMBER +
        "?text=" +
        encodeURIComponent(
          message
        );

      console.log(
        "Opening WhatsApp:",
        whatsappURL
      );

      const success =
        document.getElementById(
          "sellSuccess"
        );

      if (success) {
        success.textContent =
          "Your details are ready. WhatsApp is opening — please attach the screenshot you selected.";

        success.style.display =
          "block";
      }

      window.location.href =
        whatsappURL;
    }
  );
}


// ==================================================
// LILY NATY AI
// ==================================================

async function askLilyNatyAI(message) {

  if (!message || !String(message).trim()) {
    return "Please enter a message.";
  }

  try {

    const response =
      await fetch(
        AI_WORKER_URL,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            message:
              String(message).trim()
          })
        }
      );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ||
        "AI request failed."
      );
    }

    return (
      data.reply ||
      data.message ||
      "Sorry, I couldn't generate a response."
    );

  } catch (error) {

    console.error(
      "LILY NATY AI error:",
      error
    );

    return "Sorry, LILY NATY AI is temporarily unavailable. Please try again.";
  }
}


// ==================================================
// MAKE AI FUNCTION AVAILABLE TO THE WEBSITE
// ==================================================

window.askLilyNatyAI =
  askLilyNatyAI;


// ==================================================
// OPTIONAL AI CHAT CONNECTION
// ==================================================
//
// If your HTML already has elements with these IDs:
//
// aiForm
// aiInput
// aiMessages
//
// this will automatically connect them to the
// Cloudflare AI Worker.
//

const aiForm =
  document.getElementById(
    "aiForm"
  );

const aiInput =
  document.getElementById(
    "aiInput"
  );

const aiMessages =
  document.getElementById(
    "aiMessages"
  );


if (
  aiForm &&
  aiInput &&
  aiMessages
) {

  aiForm.addEventListener(
    "submit",
    async function (event) {

      event.preventDefault();

      const message =
        aiInput.value.trim();

      if (!message) {
        return;
      }

      aiInput.value = "";

      const userMessage =
        document.createElement(
          "div"
        );

      userMessage.className =
        "ai-user-message";

      userMessage.textContent =
        message;

      aiMessages.appendChild(
        userMessage
      );

      const loadingMessage =
        document.createElement(
          "div"
        );

      loadingMessage.className =
        "ai-loading";

      loadingMessage.textContent =
        "LILY NATY AI is thinking...";

      aiMessages.appendChild(
        loadingMessage
      );

      aiMessages.scrollTop =
        aiMessages.scrollHeight;

      const reply =
        await askLilyNatyAI(
          message
        );

      loadingMessage.remove();

      const aiMessage =
        document.createElement(
          "div"
        );

      aiMessage.className =
        "ai-message";

      aiMessage.textContent =
        reply;

      aiMessages.appendChild(
        aiMessage
      );

      aiMessages.scrollTop =
        aiMessages.scrollHeight;
    }
  );
}


// ==================================================
// START WEBSITE
// ==================================================

loadAccounts();

console.log(
  "LILY NATY MM website loaded."
);

console.log(
  "LILY NATY AI Worker:",
  AI_WORKER_URL
);
