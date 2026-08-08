```javascript
// =========================
// LILY NATY ACCOUNT DATA
// =========================

const WHATSAPP_NUMBER = "2349122602735";

const SUPABASE_URL = "https://okvlduwhehbiowdoforv.supabase.co";
const SUPABASE_KEY = "sb_publishable_CEAO6tB-YxQ_Zc3GAd82Rg_QrdC-02b";

const accounts = [
  {
    id: "001",
    title: "Free Fire MAX Account",
    game: "Free Fire",
    price: 30000,
    status: "available",
    image: "account-001.png",

    description:
      "Grand Master account with 111 rare outfits, 134 gun skins, 23 emotes and 3 Evo guns.",

    details: {
      rank: "Grand Master",
      rareOutfits: "111",
      gunSkins: "134",
      emotes: "23",
      evoGuns: "3"
    }
  },

  {
    id: "002",
    title: "Free Fire MAX Account",
    game: "Free Fire",
    price: 45000,
    status: "available",
    image: "account-002.jpg",

    description:
      "Heroic account with 138 rare outfits and 2 Evo guns.",

    details: {
      rank: "Heroic",
      rareOutfits: "138",
      gunSkins: "Not specified",
      emotes: "Not specified",
      evoGuns: "2"
    }
  }
];


// =========================
// ACCOUNT ELEMENTS
// =========================

const grid = document.getElementById("accountGrid");
const search = document.getElementById("search");
const empty = document.getElementById("empty");

let activeFilter = "all";


// =========================
// NAIRA FORMAT
// =========================

function naira(n) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0
  }).format(n);
}


// =========================
// WHATSAPP LINK
// =========================

function waLink(account) {
  const msg = encodeURIComponent(
    `Hello LILY NATY, I'm interested in Free Fire Account #${account.id} — ${naira(account.price)}. Is it still available?`
  );

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
}


// =========================
// RENDER ACCOUNTS
// =========================

function render() {
  const q = search.value.trim().toLowerCase();

  const filtered = accounts.filter(account => {
    const filterOK =
      activeFilter === "all" ||
      account.status === activeFilter;

    const searchOK =
      !q ||
      `${account.title} ${account.game} ${account.id} ${account.details.rank}`
        .toLowerCase()
        .includes(q);

    return filterOK && searchOK;
  });

  grid.innerHTML = filtered
    .map(account => `
      <article>

        <img
          src="${account.image}"
          alt="${account.title} #${account.id}"
          loading="lazy"
        >

        <div class="card-body">

          <div class="card-top">
            <span class="badge ${account.status}">
              ${account.status === "available" ? "AVAILABLE" : "SOLD"}
            </span>

            <small>#${account.id}</small>
          </div>

          <h3>${account.title}</h3>

          <p>${account.description}</p>

          <div class="price">
            ${naira(account.price)}
          </div>

          <div class="card-actions">

            <button onclick="openDetails('${account.id}')">
              View Details
            </button>

          </div>

        </div>

      </article>
    `)
    .join("");

  empty.hidden = filtered.length !== 0;
}


// =========================
// ACCOUNT DETAILS MODAL
// =========================

function openDetails(id) {
  const account = accounts.find(item => item.id === id);

  if (!account) return;

  document.getElementById("modalImg").src = account.image;

  document.getElementById("modalTitle").textContent =
    `${account.title} #${account.id}`;

  document.getElementById("modalPrice").textContent =
    naira(account.price);

  const detailsText = `
Rank: ${account.details.rank}

Rare Outfits: ${account.details.rareOutfits}

Gun Skins: ${account.details.gunSkins}

Emotes: ${account.details.emotes}

Evo Guns: ${account.details.evoGuns}

${account.description}
  `.trim();

  document.getElementById("modalDescription").textContent =
    detailsText;

  const status = document.getElementById("modalStatus");

  status.textContent =
    account.status === "available"
      ? "AVAILABLE"
      : "SOLD";

  status.className = `badge ${account.status}`;

  const wa = document.getElementById("modalWhatsApp");

  wa.href = waLink(account);

  wa.style.display =
    account.status === "available"
      ? "inline-block"
      : "none";

  document.getElementById("modal").classList.add("open");
}


// =========================
// FILTER BUTTONS
// =========================

document.querySelectorAll(".filter").forEach(button => {

  button.addEventListener("click", () => {

    document
      .querySelectorAll(".filter")
      .forEach(btn =>
        btn.classList.remove("active")
      );

    button.classList.add("active");

    activeFilter = button.dataset.filter;

    render();
  });

});


// =========================
// SEARCH
// =========================

search.addEventListener("input", render);


// =========================
// CLOSE MODAL
// =========================

document
  .getElementById("closeModal")
  .addEventListener("click", () => {

    document
      .getElementById("modal")
      .classList.remove("open");

  });


document
  .getElementById("modal")
  .addEventListener("click", event => {

    if (event.target.id === "modal") {

      event.currentTarget.classList.remove("open");

    }

  });


// =========================
// WHATSAPP BUTTONS
// =========================

document
  .querySelectorAll("[data-whatsapp]")
  .forEach(element => {

    element.href =
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        "Hello LILY NATY, I want to ask about the available Free Fire accounts."
      )}`;

  });


// ==================================================
// COMMUNITY CHAT — SUPABASE
// ==================================================

const chatForm = document.getElementById("chatForm");
const chatNickname = document.getElementById("chatNickname");
const chatMessage = document.getElementById("chatMessage");
const chatMessages = document.getElementById("chatMessages");
const chatStatus = document.getElementById("chatStatus");


// =========================
// LOAD CHAT MESSAGES
// =========================

async function loadMessages() {

  try {

    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/messages?select=*&order=created_at.asc`,
      {
        method: "GET",

        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization": `Bearer ${SUPABASE_KEY}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(
        `Supabase error: ${response.status}`
      );
    }

    const messages = await response.json();

    chatMessages.innerHTML = "";

    if (messages.length === 0) {

      chatMessages.innerHTML = `
        <div class="chat-empty">
          No messages yet. Be the first to say hello 👋
        </div>
      `;

      return;
    }

    messages.forEach(message => {
      displayMessage(message);
    });

    chatMessages.scrollTop =
      chatMessages.scrollHeight;

  } catch (error) {

    console.error("Chat loading error:", error);

    chatMessages.innerHTML = `
      <div class="chat-empty">
        Unable to load messages.
      </div>
    `;

  }

}


// =========================
// DISPLAY ONE MESSAGE
// =========================

function displayMessage(message) {

  const messageDiv =
    document.createElement("div");

  messageDiv.className = "chat-message";

  const name =
    document.createElement("strong");

  name.textContent =
    message.nickname;

  const text =
    document.createElement("p");

  text.textContent =
    message.message;

  const time =
    document.createElement("small");

  const date =
    new Date(message.created_at);

  time.textContent =
    date.toLocaleString();

  messageDiv.appendChild(name);
  messageDiv.appendChild(text);
  messageDiv.appendChild(time);

  chatMessages.appendChild(messageDiv);
}


// =========================
// SEND CHAT MESSAGE
// =========================

if (chatForm) {

  chatForm.addEventListener(
    "submit",
    async event => {

      event.preventDefault();

      const nickname =
        chatNickname.value.trim();

      const message =
        chatMessage.value.trim();

      if (!nickname || !message) {
        return;
      }

      chatStatus.textContent =
        "Sending...";

      try {

        const response =
          await fetch(
            `${SUPABASE_URL}/rest/v1/messages`,
            {
              method: "POST",

              headers: {
                "apikey": SUPABASE_KEY,
                "Authorization":
                  `Bearer ${SUPABASE_KEY}`,

                "Content-Type":
                  "application/json",

                "Prefer":
                  "return=representation"
              },

              body: JSON.stringify({
                nickname: nickname,
                message: message
              })
            }
          );


        if (!response.ok) {

          const errorText =
            await response.text();

          console.error(
            "Supabase send error:",
            errorText
          );

          throw new Error(
            `Message failed: ${response.status}`
          );

        }


        const saved =
          await response.json();


        if (saved.length > 0) {

          displayMessage(saved[0]);

        }


        chatMessage.value = "";

        chatStatus.textContent =
          "Message sent ✓";

        chatMessages.scrollTop =
          chatMessages.scrollHeight;


        setTimeout(() => {

          chatStatus.textContent = "";

        }, 2000);


      } catch (error) {

        console.error(error);

        chatStatus.textContent =
          "Message could not be sent. Check Supabase.";

      }

    }
  );

}


// =========================
// START CHAT
// =========================

loadMessages();


// =========================
// START WEBSITE
// =========================

render();
```
