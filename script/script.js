const state = {
  categories: [],
  allPlants: [],
  visiblePlants: [],
  activeCategoryId: "allTreesBtn",
  searchText: "",
  sortValue: "default",
  cart: [],
  justCheckedOut: false,
};

const elements = {
  categoriesContainer: document.getElementById("categoriesContainer"),
  allTreesBtn: document.getElementById("allTreesBtn"),
  plantsContainer: document.getElementById("plantsContainer"),
  emptyState: document.getElementById("emptyState"),
  spinner: document.getElementById("spinner"),
  totalItems: document.getElementById("totalItems"),
  totalPrice: document.getElementById("totalPrice"),
  cartContainer: document.getElementById("cartContainer"),
  cartBadgeButton: document.getElementById("cartBadgeButton"),
  searchInput: document.getElementById("searchInput"),
  sortSelect: document.getElementById("sortSelect"),
  checkoutBtn: document.getElementById("checkoutBtn"),
  statProducts: document.getElementById("statProducts"),
  statCategories: document.getElementById("statCategories"),
  statOrders: document.getElementById("statOrders"),
  contactForm: document.getElementById("contactForm"),
  contactFeedback: document.getElementById("contactFeedback"),
  navToggleButton: document.getElementById("navToggleButton"),
  primaryNav: document.getElementById("primaryNav"),
  navOpenIcon: document.getElementById("navOpenIcon"),
  navCloseIcon: document.getElementById("navCloseIcon"),
};

const API_BASE = "https://openapi.programming-hero.com/api";
const desktopNavQuery = window.matchMedia("(min-width: 768px)");

const formatCurrency = (value) => `$${Number(value).toLocaleString()}`;

const closePrimaryNav = () => {
  elements.primaryNav.classList.add("hidden");
  elements.primaryNav.classList.remove("flex");
  elements.navToggleButton.setAttribute("aria-expanded", "false");
  elements.navOpenIcon.classList.remove("hidden");
  elements.navCloseIcon.classList.add("hidden");
};

const openPrimaryNav = () => {
  elements.primaryNav.classList.remove("hidden");
  elements.primaryNav.classList.add("flex");
  elements.navToggleButton.setAttribute("aria-expanded", "true");
  elements.navOpenIcon.classList.add("hidden");
  elements.navCloseIcon.classList.remove("hidden");
};

const togglePrimaryNav = () => {
  if (elements.primaryNav.classList.contains("hidden")) {
    openPrimaryNav();
  } else {
    closePrimaryNav();
  }
};

const showSpinner = () => {
  elements.spinner.classList.remove("hidden");
  elements.plantsContainer.classList.add("hidden");
  elements.emptyState.classList.add("hidden");
};

const hideSpinner = () => {
  elements.spinner.classList.add("hidden");
  elements.plantsContainer.classList.remove("hidden");
};

const setActiveCategory = (id) => {
  state.activeCategoryId = id;
  document.querySelectorAll(".category-btn").forEach((btn) => {
    if (btn.id === id) {
      btn.classList.remove("btn-outline");
      btn.classList.add("btn-success");
    } else {
      btn.classList.remove("btn-success");
      btn.classList.add("btn-outline");
    }
  });
};

const createCategoryButton = (category) => {
  const button = document.createElement("button");
  button.id = String(category.id);
  button.type = "button";
  button.className = "category-btn btn btn-outline btn-sm w-full justify-start";
  button.textContent = category.category_name;
  button.addEventListener("click", () => {
    loadCategoryPlants(button.id);
    setActiveCategory(button.id);
  });
  return button;
};

const displayCategories = (categories) => {
  elements.categoriesContainer.innerHTML = "";
  const fragment = document.createDocumentFragment();
  categories.forEach((category) => {
    fragment.appendChild(createCategoryButton(category));
  });
  elements.categoriesContainer.appendChild(fragment);
};

const createPlantCard = (plant) => {
  const article = document.createElement("article");
  article.className = "card border border-base-200 bg-base-100 shadow-sm transition hover:shadow-md";
  article.innerHTML = `
    <figure class="px-3 pt-3">
      <img src="${plant.image}" alt="${plant.name}" data-action="details" data-id="${plant.id}" class="h-40 w-full rounded-xl object-cover cursor-pointer" />
    </figure>
    <div class="card-body p-3">
      <h4 class="cursor-pointer text-base font-bold text-success" data-action="details" data-id="${plant.id}">${plant.name}</h4>
      <p class="text-xs text-slate-500">${plant.description.slice(0, 70)}...</p>
      <div class="mt-2 flex items-center justify-between gap-2">
        <span class="text-lg font-extrabold text-success">${formatCurrency(plant.price)}</span>
        <button class="btn btn-success btn-xs" type="button" data-action="add-cart" data-id="${plant.id}">Add to cart</button>
      </div>
    </div>
  `;
  return article;
};

const renderPlants = () => {
  let plants = [...state.visiblePlants];

  if (state.searchText) {
    const keyword = state.searchText.toLowerCase();
    plants = plants.filter(
      (plant) =>
        plant.name.toLowerCase().includes(keyword) ||
        plant.category.toLowerCase().includes(keyword),
    );
  }

  if (state.sortValue === "price-low-high") {
    plants.sort((a, b) => a.price - b.price);
  } else if (state.sortValue === "price-high-low") {
    plants.sort((a, b) => b.price - a.price);
  } else if (state.sortValue === "name-a-z") {
    plants.sort((a, b) => a.name.localeCompare(b.name));
  }

  elements.plantsContainer.innerHTML = "";
  const fragment = document.createDocumentFragment();
  plants.forEach((plant) => {
    fragment.appendChild(createPlantCard(plant));
  });
  elements.plantsContainer.appendChild(fragment);

  elements.emptyState.classList.toggle("hidden", plants.length > 0);
};

const createCartItem = (item, subtotal) => {
  const article = document.createElement("article");
  article.className = "rounded-lg border border-base-200 p-3";
  article.innerHTML = `
    <div class="flex items-start justify-between gap-2">
      <div>
        <h4 class="text-sm font-bold">${item.name}</h4>
        <p class="text-xs text-slate-500">${formatCurrency(item.price)} each</p>
      </div>
      <button class="btn btn-ghost btn-xs" type="button" data-action="remove-item" data-id="${item.id}">Remove</button>
    </div>
    <div class="mt-2 flex items-center justify-between gap-2">
      <div class="join">
        <button class="btn btn-xs join-item" type="button" data-action="dec-qty" data-id="${item.id}">-</button>
        <button class="btn btn-xs join-item" type="button">${item.qty}</button>
        <button class="btn btn-xs join-item" type="button" data-action="inc-qty" data-id="${item.id}">+</button>
      </div>
      <span class="text-sm font-bold text-success">${formatCurrency(subtotal)}</span>
    </div>
  `;
  return article;
};

const renderCart = () => {
  if (state.cart.length === 0) {
    if (state.justCheckedOut) {
      elements.cartContainer.innerHTML = `<div class="h-full rounded-xl bg-green-100"></div>`;
    } else {
      elements.cartContainer.innerHTML = `<p class="text-sm text-slate-500">No items in cart</p>`;
    }
    elements.totalItems.textContent = "0";
    elements.totalPrice.textContent = "$0";
    elements.cartBadgeButton.textContent = "Cart (0)";
    return;
  }

  let totalPrice = 0;
  let totalItems = 0;

  elements.cartContainer.innerHTML = "";
  const fragment = document.createDocumentFragment();
  state.cart.forEach((item) => {
    const subtotal = item.price * item.qty;
    totalPrice += subtotal;
    totalItems += item.qty;
    fragment.appendChild(createCartItem(item, subtotal));
  });
  elements.cartContainer.appendChild(fragment);

  elements.totalItems.textContent = `${totalItems}`;
  elements.totalPrice.textContent = formatCurrency(totalPrice);
  elements.cartBadgeButton.textContent = `Cart (${totalItems})`;
  elements.statOrders.textContent = `${totalItems + 120}+`;
};

const addToCart = (plantId) => {
  const plant = state.allPlants.find((item) => item.id === plantId);
  if (!plant) return;
  state.justCheckedOut = false;

  const existing = state.cart.find((item) => item.id === plantId);
  if (existing) {
    existing.qty += 1;
  } else {
    state.cart.push({ id: plant.id, name: plant.name, price: plant.price, qty: 1 });
  }

  renderCart();
};

const decreaseQty = (plantId) => {
  const found = state.cart.find((item) => item.id === plantId);
  if (!found) return;

  found.qty -= 1;
  if (found.qty <= 0) {
    state.cart = state.cart.filter((item) => item.id !== plantId);
  }

  renderCart();
};

const increaseQty = (plantId) => {
  const found = state.cart.find((item) => item.id === plantId);
  if (!found) return;
  found.qty += 1;
  renderCart();
};

const removeItem = (plantId) => {
  state.cart = state.cart.filter((item) => item.id !== plantId);
  renderCart();
};

const showDetails = (plant) => {
  const host = document.getElementById("showdetails");
  host.innerHTML = `
    <dialog id="treeDetailsModal" class="modal">
      <div class="modal-box">
        <div class="mb-3 flex items-center justify-between">
          <h3 class="text-xl font-bold">${plant.name}</h3>
          <button class="btn btn-ghost btn-sm btn-circle" type="button" data-action="close-modal">x</button>
        </div>
        <img src="${plant.image}" alt="${plant.name}" class="mb-3 h-60 w-full rounded-xl object-cover" />
        <p class="text-sm text-slate-600">${plant.description}</p>
        <p class="mt-2 text-sm"><strong>Category:</strong> ${plant.category}</p>
        <p class="text-lg font-bold text-success"><strong>Price:</strong> ${formatCurrency(plant.price)}</p>
      </div>
    </dialog>
  `;

  const modal = document.getElementById("treeDetailsModal");
  modal.showModal();
  modal.addEventListener("click", (event) => {
    if (event.target.dataset.action === "close-modal") {
      modal.close();
    }
  });
};

const loadPlantDetails = async (plantId) => {
  try {
    const response = await fetch(`${API_BASE}/plant/${plantId}`);
    const data = await response.json();
    showDetails(data.plants);
  } catch (_error) {
    alert("Unable to load plant details right now.");
  }
};

const applyVisiblePlants = (plants) => {
  state.visiblePlants = plants;
  renderPlants();
  hideSpinner();
};

const loadAllPlants = async () => {
  showSpinner();
  try {
    const response = await fetch(`${API_BASE}/plants`);
    const data = await response.json();
    state.allPlants = data.plants || [];
    applyVisiblePlants(state.allPlants);
  } catch (_error) {
    state.allPlants = [];
    applyVisiblePlants([]);
  }
};

const loadCategoryPlants = async (categoryId) => {
  showSpinner();
  try {
    const response = await fetch(`${API_BASE}/category/${categoryId}`);
    const data = await response.json();
    applyVisiblePlants(data.plants || []);
  } catch (_error) {
    applyVisiblePlants([]);
  }
};

const loadCategories = async () => {
  try {
    const response = await fetch(`${API_BASE}/categories`);
    const data = await response.json();
    state.categories = data.categories || [];
    displayCategories(state.categories);
    elements.statCategories.textContent = `${state.categories.length}+`;
  } catch (_error) {
    state.categories = [];
    elements.categoriesContainer.innerHTML = "";
  }
};

const handleProductsClick = (event) => {
  const trigger = event.target instanceof Element ? event.target.closest("[data-action]") : null;
  if (!trigger) return;

  const action = trigger.dataset.action;
  const plantId = Number(trigger.dataset.id);

  if (action === "details") {
    loadPlantDetails(plantId);
  } else if (action === "add-cart") {
    addToCart(plantId);
  }
};

const handleCartClick = (event) => {
  const trigger = event.target instanceof Element ? event.target.closest("[data-action]") : null;
  if (!trigger) return;

  const action = trigger.dataset.action;
  const plantId = Number(trigger.dataset.id);

  if (action === "dec-qty") {
    decreaseQty(plantId);
  } else if (action === "inc-qty") {
    increaseQty(plantId);
  } else if (action === "remove-item") {
    removeItem(plantId);
  }
};

const bindEvents = () => {
  elements.allTreesBtn.addEventListener("click", () => {
    setActiveCategory("allTreesBtn");
    loadAllPlants();
  });

  elements.searchInput.addEventListener("input", (event) => {
    state.searchText = event.target.value.trim();
    renderPlants();
  });

  elements.sortSelect.addEventListener("change", (event) => {
    state.sortValue = event.target.value;
    renderPlants();
  });

  elements.plantsContainer.addEventListener("click", handleProductsClick);
  elements.cartContainer.addEventListener("click", handleCartClick);

  elements.checkoutBtn.addEventListener("click", () => {
    if (!state.cart.length) return;
    alert("Order placed successfully!");
    state.cart = [];
    state.justCheckedOut = true;
    renderCart();
  });

  elements.cartBadgeButton.addEventListener("click", () => {
    document.querySelector(".cart-panel").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  elements.navToggleButton.addEventListener("click", () => {
    if (desktopNavQuery.matches) return;
    togglePrimaryNav();
  });

  elements.primaryNav.addEventListener("click", (event) => {
    if (desktopNavQuery.matches) return;
    const link = event.target instanceof Element ? event.target.closest("a") : null;
    if (link) {
      closePrimaryNav();
    }
  });

  const handleNavBreakpointChange = () => {
    closePrimaryNav();
  };

  if (typeof desktopNavQuery.addEventListener === "function") {
    desktopNavQuery.addEventListener("change", handleNavBreakpointChange);
  } else {
    desktopNavQuery.addListener(handleNavBreakpointChange);
  }

  elements.contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    elements.contactFeedback.textContent = "Thanks. We received your message.";
    elements.contactForm.reset();
  });
};

const init = async () => {
  bindEvents();
  closePrimaryNav();
  setActiveCategory("allTreesBtn");
  renderCart();
  await Promise.all([loadCategories(), loadAllPlants()]);
};

init();
