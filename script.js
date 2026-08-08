// =========================
// LILY NATY ACCOUNT DATA
// =========================

const WHATSAPP_NUMBER = "2349122602735";

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

const grid = document.getElementById("accountGrid");
const search = document.getElementById("search");
const empty = document.getElementById("empty");

let activeFilter = "all";

function naira(n) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0
  }).format(n);
}

function waLink(account) {
  const msg = encodeURIComponent(
    `Hello LILY NATY, I'm interested in Free Fire Account #${account.id} — ${naira(account.price)}. Is it still available?`
  );

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
}

function render() {
  const q = search.value.trim().toLowerCase();

  const filtered = accounts.filter(account => {
    const filterOK =
      activeFilter === "all" || account.status === activeFilter;

    const searchOK =
      !q ||
      `${account.title} ${account.game} ${account.id} ${account.details.rank}`
        .toLowerCase()
        .includes(q);

    return filterOK && searchOK;
  });

  grid.innerHTML = filtered
    .map(account => `
      <article class="card">

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
    account.status === "available" ? "AVAILABLE" : "SOLD";

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
      .forEach(btn => btn.classList.remove("active"));

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

document.querySelectorAll("[data-whatsapp]").forEach(element => {

  element.href =
    `https://wa.me/${WHATSAPP_NUMBER}?text=${
      encodeURIComponent(
        "Hello LILY NATY, I want to ask about the available Free Fire accounts."
      )
    }`;

});

// =========================
// START WEBSITE
// =========================

render();
