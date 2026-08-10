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
  const keys = Object.keys(row || {});

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
      getValue(row, ["ID"]) || ""
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
        getValue(row, [
          "Rare Outfits",
          "rare outfits"
        ]) || "Not specified",

      gunSkins:
        getValue(row, [
          "Gunskins",
          "Gun Skins",
          "gun skins"
        ]) || "Not specified",

      emotes:
        getValue(row, ["Emotes"]) ||
        "Not specified",

      evoGuns:
        getValue(row, [
          "Evo Guns",
          "evo guns"
        ]) || "Not specified"
    }
  };
}


// ==================================================
// LOAD ACCOUNTS FROM GOOGLE SHEETS
// ==================================================

async function loadAccounts() {
  try {
    if (grid) {
      grid.innerHTML = "<p>Loading accounts...</p>";
    }

    const response = await fetch(
      GOOGLE_SHEET_API + "?t=" + Date.now()
    );

    if (!response.ok) {
      throw new Error(
        "Google Sheet returned HTTP " +
        response.status
      );
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error(
        "Google Sheet did not return an array."
      );
    }

    accounts = data
      .map(convertAccount)
      .filter(function (account) {
        return account.id !== "";
      });

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
        '<p style="color:#ff7777;padding:20px;">Unable to load accounts right now. Please try again later.</p>';
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
// ESCAPE HTML
// ==================================================

function escapeHTML(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
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
    accounts.filter(function (account) {

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
        account.details.rank +
        " " +
        account.description
      ).toLowerCase();

      const searchOK =
        !q ||
        searchText.includes(q);

      return filterOK && searchOK;
    });


  if (filtered.length === 0) {

    grid.innerHTML = "";

  } else {

    grid.innerHTML =
      filtered
        .map(function (account) {

          const isSold =
            account.status === "sold";

          const safeId =
            encodeURIComponent(
              account.id
            );

          const image =
            escapeHTML(account.image);

          const title =
            escapeHTML(account.title);

          const description =
            escapeHTML(
              account.description
            );

          return (
            '<article class="' +
            (isSold
              ? "sold-account"
              : "") +
            '">' +

              '<img ' +
                'src="' +
                image +
                '" ' +
                'alt="' +
                title +
                " #" +
                escapeHTML(account.id) +
                '" ' +
                'loading="lazy" ' +
                'onerror="this.style.display=\'none\'">' +

              '<div class="card-body">' +

                '<div class="card-top">' +

                  '<span class="badge ' +
                    (isSold
                      ? "sold"
                      : "available") +
                  '">' +

                    (isSold
                      ? "SOLD"
                      : "AVAILABLE") +

                  "</span>" +

                  "<small>#" +
                    escapeHTML(account.id) +
                  "</small>" +

                "</div>" +

                "<h3>" +
                  title +
                "</h3>" +

                "<p>" +
                  description +
                "</p>" +

                '<div class="price">' +
                  naira(account.price) +
                "</div>" +

                '<div class="card-actions">' +

                  '<button ' +
                    'type="button" ' +
                    'onclick="openDetails(decodeURIComponent(\'' +
                    safeId +
                    "'))\">" +

                    "View Details" +

                  "</button>" +

                "</div>" +

              "</div>" +

            "</article>"
          );

        })
        .join("");
  }


  if (empty) {
    empty.hidden =
      filtered.length !== 0;
  }
}


// ==================================================
// ACCOUNT DETAILS MODAL
// ==================================================

function openDetails(id) {

  const account =
    accounts.find(function (item) {
      return item.id === String(id);
    });


  if (!account) {

    console.error(
      "Account not found:",
      id
    );

    return;
  }


  const modalImg =
    document.getElementById(
      "modalImg"
    );

  const modalTitle =
    document.getElementById(
      "modalTitle"
    );

  const modalPrice =
    document.getElementById(
      "modalPrice"
    );

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
    document.getElementById(
      "modal"
    );


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

    modalDescription.style.whiteSpace =
      "pre-line";

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

    modal.classList.add(
      "open"
    );
  }
}


// ==================================================
// MAKE OPEN DETAILS AVAILABLE TO HTML
// ==================================================

window.openDetails =
  openDetails;


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
          button.dataset.filter ||
          "all";


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
// CLOSE ACCOUNT MODAL
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


const accountModal =
  document.getElementById(
    "modal"
  );


if (accountModal) {

  accountModal.addEventListener(
    "click",
    function (event) {

      if (
        event.target ===
        accountModal
      ) {

        accountModal.classList.remove(
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

    element.target =
      "_blank";

    element.rel =
      "noopener";

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


      const getInputValue =
        function (id) {

          const element =
            document.getElementById(
              id
            );

          return element
            ? element.value.trim()
            : "";

        };


      const sellerName =
        getInputValue(
          "sellerName"
        );

      const accountTitle =
        getInputValue(
          "accountTitle"
        );

      const accountRank =
        getInputValue(
          "accountRank"
        );

      const accountPrice =
        getInputValue(
          "accountPrice"
        );

      const rareOutfits =
        getInputValue(
          "rareOutfits"
        );

      const gunskins =
        getInputValue(
          "gunskins"
        );

      const emotes =
        getInputValue(
          "emotes"
        );

      const evoGuns =
        getInputValue(
          "evoGuns"
        );

      const description =
        getInputValue(
          "accountDescription"
        );


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


      const numericPrice =
        Number(
          accountPrice
        ) || 0;


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
        naira(
          numericPrice
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


      window.open(
        whatsappURL,
        "_blank"
      );

    }
  );

}


// ==================================================
// LILY NATY AI
// CLOUDFLARE WORKER
// ==================================================

async function askLilyNatyAI(message) {

  if (
    !message ||
    !String(message).trim()
  ) {

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


    return (
      "Sorry, LILY NATY AI is temporarily unavailable. " +
      "Please try again."
    );
  }
}


// ==================================================
// MAKE AI FUNCTION AVAILABLE
// ==================================================

window.askLilyNatyAI =
  askLilyNatyAI;


// ==================================================
// IMPORTANT:
// AI BOT ELEMENTS ARE READ HERE,
// BUT NOT DUPLICATED IN HTML.
// ==================================================

const lilyBotButton =
  document.getElementById(
    "lilyBotButton"
  );

const lilyBot =
  document.getElementById(
    "lilyBot"
  );

const lilyBotClose =
  document.getElementById(
    "lilyBotClose"
  );

const lilyBotInput =
  document.getElementById(
    "lilyBotInput"
  );

const lilyBotSend =
  document.getElementById(
    "lilyBotSend"
  );

const lilyBotMessages =
  document.getElementById(
    "lilyBotMessages"
  );


// ==================================================
// OPEN AI BOT
// ==================================================

if (
  lilyBotButton &&
  lilyBot
) {

  lilyBotButton.addEventListener(
    "click",
    function () {

      lilyBot.classList.toggle(
        "open"
      );


      if (
        lilyBot.classList.contains(
          "open"
        ) &&
        lilyBotInput
      ) {

        lilyBotInput.focus();

      }

    }
  );

}


// ==================================================
// CLOSE AI BOT
// ==================================================

if (
  lilyBotClose &&
  lilyBot
) {

  lilyBotClose.addEventListener(
    "click",
    function () {

      lilyBot.classList.remove(
        "open"
      );

    }
  );

}


// ==================================================
// ADD AI MESSAGE
// ==================================================

function lilyAddMessage(
  text,
  type
) {

  if (!lilyBotMessages) {
    return;
  }


  const message =
    document.createElement(
      "div"
    );


  message.className =
    "lily-message " +
    (
      type === "user"
        ? "lily-user-message"
        : "lily-bot-message"
    );


  message.innerHTML =
    String(text)
      .replace(/\n/g, "<br>");


  lilyBotMessages.appendChild(
    message
  );


  lilyBotMessages.scrollTop =
    lilyBotMessages.scrollHeight;
}


// ==================================================
// WHATSAPP FROM AI
// ==================================================

function lilyWhatsApp() {

  const message =
    encodeURIComponent(
      "Hello LILY NATY, I need help with a Free Fire account."
    );


  window.open(
    "https://wa.me/" +
    WHATSAPP_NUMBER +
    "?text=" +
    message,
    "_blank"
  );
}


window.lilyWhatsApp =
  lilyWhatsApp;


// ==================================================
// SEND MESSAGE TO CLOUDFLARE AI
// ==================================================

async function lilySendMessage() {

  if (
    !lilyBotInput ||
    !lilyBotMessages
  ) {

    return;
  }


  const text =
    lilyBotInput.value.trim();


  if (!text) {
    return;
  }


  lilyAddMessage(
    text,
    "user"
  );


  lilyBotInput.value = "";


  const loading =
    document.createElement(
      "div"
    );


  loading.className =
    "lily-message lily-bot-message";


  loading.textContent =
    "LILY NATY AI is thinking...";


  lilyBotMessages.appendChild(
    loading
  );


  lilyBotMessages.scrollTop =
    lilyBotMessages.scrollHeight;


  const answer =
    await askLilyNatyAI(
      text
    );


  loading.remove();


  lilyAddMessage(
    answer,
    "bot"
  );
}


// ==================================================
// SEND BUTTON
// ==================================================

if (lilyBotSend) {

  lilyBotSend.addEventListener(
    "click",
    lilySendMessage
  );

}


// ==================================================
// ENTER KEY
// ==================================================

if (lilyBotInput) {

  lilyBotInput.addEventListener(
    "keydown",
    function (event) {

      if (
        event.key ===
        "Enter"
      ) {

        event.preventDefault();

        lilySendMessage();

      }

    }
  );

}


// ==================================================
// QUICK AI BUTTONS
// ==================================================

async function lilyQuick(text) {

  if (!text) {
    return;
  }


  lilyAddMessage(
    text,
    "user"
  );


  const loading =
    document.createElement(
      "div"
    );


  loading.className =
    "lily-message lily-bot-message";


  loading.textContent =
    "LILY NATY AI is thinking...";


  if (lilyBotMessages) {

    lilyBotMessages.appendChild(
      loading
    );

    lilyBotMessages.scrollTop =
      lilyBotMessages.scrollHeight;
  }


  const answer =
    await askLilyNatyAI(
      text
    );


  loading.remove();


  lilyAddMessage(
    answer,
    "bot"
  );
}


window.lilyQuick =
  lilyQuick;


// ==================================================
// START WEBSITE
// ==================================================

console.log(
  "LILY NATY MM website loaded."
);

console.log(
  "Google Sheets API:",
  GOOGLE_SHEET_API
);

console.log(
  "LILY NATY AI Worker:",
  AI_WORKER_URL
);


loadAccounts();
