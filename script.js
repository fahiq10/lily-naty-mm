// =========================
// LILY NATY ACCOUNT DATA
// Add new accounts inside this array.
// status must be "available" or "sold".
// =========================
const WHATSAPP_NUMBER = "2349122602735"; // <-- REPLACE with your WhatsApp number, country code, no + or spaces.

const accounts = [
  {
    id: "001",
    title: "Free Fire MAX Account",
    game: "Free Fire",
    price: 30000,
    status: "available",
    image: "account-002.jpg",
    description: "Free Fire account listing. Screenshots provided for preview. Contact LILY NATY for full details."
  },
  {
    id: "002",
    title: "Free Fire MAX Account",
    game: "Free Fire",
    price: 45000,
    status: "available",
    image: "account-003.jpg",
    description: "Free Fire account listing. Screenshots provided for preview. Contact LILY NATY for full details."
  },
  {
    id: "003",
    title: "Free Fire MAX Account",
    game: "Free Fire",
    price: 80000,
    status: "available",
    image: "account-004.jpg",
    description: "Premium Free Fire account listing. Screenshots provided for preview. Contact LILY NATY for full details."
  },
  {
    id: "004",
    title: "Free Fire MAX Account",
    game: "Free Fire",
    price: 20000,
    status: "available",
    image: "account-005.jpg",
    description: "Free Fire account listing. Screenshots provided for preview. Contact LILY NATY for full details."
  },
  {
    id: "005",
    title: "Free Fire MAX Account",
    game: "Free Fire",
    price: 50000,
    status: "available",
    image: "account-006.png",
    description: "Free Fire account listing. Screenshots provided for preview. Contact LILY NATY for full details."
  }
];

const grid = document.getElementById("accountGrid");
const search = document.getElementById("search");
const empty = document.getElementById("empty");
let activeFilter = "all";

function naira(n) {
  return new Intl.NumberFormat("en-NG", {style:"currency", currency:"NGN", maximumFractionDigits:0}).format(n);
}

function waLink(account) {
  const msg = encodeURIComponent(`Hello LILY NATY, I'm interested in Free Fire Account #${account.id} — ${account.title} (${naira(account.price)}). Is it still available?`);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
}

function render() {
  const q = search.value.trim().toLowerCase();
  const filtered = accounts.filter(a => {
    const filterOK = activeFilter === "all" || a.status === activeFilter;
    const searchOK = !q || `${a.title} ${a.game} ${a.id}`.toLowerCase().includes(q);
    return filterOK && searchOK;
  });

  grid.innerHTML = filtered.map(a => `
    <article class="card">
      <img src="${a.image}" alt="${a.title}" loading="lazy">
      <div class="card-body">
        <div class="card-top">
          <span class="badge ${a.status}">${a.status === "available" ? "AVAILABLE" : "SOLD"}</span>
          <small>#${a.id}</small>
        </div>
        <h3>${a.title}</h3>
        <p>${a.description}</p>
        <div class="price">${naira(a.price)}</div>
        <div class="card-actions">
          <button onclick="openDetails('${a.id}')">View Details</button>
          ${a.status === "available"
            ? `<a href="${waLink(a)}" target="_blank" rel="noopener">Contact to Buy</a>`
            : `<button disabled>Sold Out</button>`}
        </div>
      </div>
    </article>
  `).join("");

  empty.hidden = filtered.length !== 0;
}

function openDetails(id) {
  const a = accounts.find(x => x.id === id);
  if (!a) return;
  document.getElementById("modalImg").src = a.image;
  document.getElementById("modalTitle").textContent = a.title;
  document.getElementById("modalPrice").textContent = naira(a.price);
  document.getElementById("modalDescription").textContent = a.description;
  const status = document.getElementById("modalStatus");
  status.textContent = a.status === "available" ? "AVAILABLE" : "SOLD";
  status.className = `badge ${a.status}`;
  const wa = document.getElementById("modalWhatsApp");
  wa.href = waLink(a);
  wa.style.display = a.status === "available" ? "inline-block" : "none";
  document.getElementById("modal").classList.add("open");
}

document.querySelectorAll(".filter").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    activeFilter = btn.dataset.filter;
    render();
  });
});

search.addEventListener("input", render);
document.getElementById("closeModal").addEventListener("click", () => document.getElementById("modal").classList.remove("open"));
document.getElementById("modal").addEventListener("click", e => {
  if (e.target.id === "modal") e.currentTarget.classList.remove("open");
});

document.querySelectorAll("[data-whatsapp]").forEach(el => {
  el.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello LILY NATY, I want to ask about the available Free Fire accounts.")}`;
});

render();
