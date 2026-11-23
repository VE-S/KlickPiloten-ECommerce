let cart = [];
const DEMO_ACCOUNT_KEY = "demoshop_demo_account";
const DEMO_NEWSLETTER_KEY = "demoshop_newsletter";
const DEMO_ORDERS_KEY = "demoshop_order_history";
const DEMO_DISCOUNT_KEY = "demoshop_discount";
const DEMO_CODE = "WELCOME10";
const demoRead = key => { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } };
const demoEmit = (event, fields = {}) => window.dataLayer?.push({event, ...fields});
const discountActive = () => localStorage.getItem(DEMO_DISCOUNT_KEY) === DEMO_CODE;
const cartSubtotal = () => cart.reduce((sum, product) => sum + product.price, 0);
const cartPayable = () => Math.round(cartSubtotal() * (discountActive() ? 0.9 : 1) * 100) / 100;


const PRODUCTS = {
    headphones: {name: "Wireless Headphones", price: 79.99, category: "Audio"},
    smartwatch: {name: "Smart Watch", price: 129.99, category: "Wearables"}
};
const LIST = {item_list_id: "main_collection", item_list_name: "Main Collection"};
const ga4Item = (id, quantity = 1, index) => {
    const p = PRODUCTS[id];
    const item = {item_id: id, item_name: p.name, item_category: p.category, price: p.price, quantity};
    if (index !== undefined) item.index = index;
    return item;
};
const pushEcommerce = (event, ecommerce) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ecommerce: null});
    demoEmit(event, {ecommerce});
};
const cartItems = () => {
    const map = new Map();
    cart.forEach(p => map.set(p.id, (map.get(p.id) || 0) + 1));
    return Array.from(map, ([id, qty], i) => ga4Item(id, qty, i));
};

let checkoutStep = 0; // 0 = none, 1 = begin_checkout, 2 = shipping done
let viewedCartSignature = "";

function resetCheckout() {
    checkoutStep = 0;
    document.getElementById("checkout-section").classList.add("hidden");
    document.getElementById("payment-step").classList.add("hidden");
    document.getElementById("shipping-step").classList.remove("hidden");
}

function addToCart(productId) {
    const p = PRODUCTS[productId];
    if (!p) return;
    cart.push({id: productId, price: p.price});
    resetCheckout();
    pushEcommerce("add_to_cart", {
        currency: "EUR",
        value: p.price,
        items: [{...ga4Item(productId), ...LIST}]
    });
    document.getElementById("purchase-message").classList.add("hidden");
    updateCart();
}

function removeFromCart(productId) {
    const index = cart.findIndex(p => p.id === productId);
    if (index === -1) return;
    const [removed] = cart.splice(index, 1);
    resetCheckout();
    pushEcommerce("remove_from_cart", {
        currency: "EUR",
        value: removed.price,
        items: [ga4Item(productId)]
    });
    updateCart();
}

function updateCart() {
    const cartElement = document.getElementById("cart");
    const checkoutButton = document.getElementById("checkout-btn");
    cartElement.innerHTML = "";

    if (cart.length === 0) {
        cartElement.textContent = "Your cart is empty.";
        resetCheckout();
    } else {
        const list = document.createElement("ul");
        cartItems().forEach(line => {
            const item = document.createElement("li");
            const text = document.createElement("span");
            text.textContent = `${line.item_name} × ${line.quantity} - €${(line.price * line.quantity).toFixed(2)} `;
            const removeButton = document.createElement("button");
            removeButton.textContent = "Remove one";
            removeButton.onclick = () => removeFromCart(line.item_id);
            item.append(text, removeButton);
            list.appendChild(item);
        });
        cartElement.appendChild(list);
    }

    document.getElementById("cart-total").textContent = cartSubtotal().toFixed(2);
    document.getElementById("discounted-total").textContent = cartPayable().toFixed(2);
    document.getElementById("discount-status").textContent = discountActive() ? "WELCOME10 applied · 10% off" : "";
    const counter = document.getElementById("cart-count");
    if (counter) counter.textContent = cart.length;
    checkoutButton.disabled = cart.length === 0;
}

function beginCheckout() {
    if (cart.length === 0) return;
    checkoutStep = 1;
    document.getElementById("checkout-section").classList.remove("hidden");
    pushEcommerce("begin_checkout", {
        currency: "EUR",
        value: cartPayable(),
        coupon: discountActive() ? DEMO_CODE : undefined,
        items: cartItems()
    });
}

function submitShipping() {
    if (checkoutStep !== 1) return;
    checkoutStep = 2;
    const tier = document.getElementById("shipping-tier").value;
    pushEcommerce("add_shipping_info", {
        currency: "EUR",
        value: cartPayable(),
        coupon: discountActive() ? DEMO_CODE : undefined,
        shipping_tier: tier,
        items: cartItems()
    });
    document.getElementById("shipping-step").classList.add("hidden");
    document.getElementById("payment-step").classList.remove("hidden");
}

function completePurchase() {
    if (cart.length === 0 || checkoutStep !== 2) return;

    const placeBtn = document.getElementById("place-order-btn");
    placeBtn.disabled = true;
    const subtotal = Math.round(cartSubtotal() * 100) / 100;
    const hasDiscount = discountActive();
    const total = cartPayable();
    const transactionId = "DEMO-" + crypto.randomUUID();
    const items = cartItems();
    const shippingTier = document.getElementById("shipping-tier").value;
    const paymentType = document.getElementById("payment-type").value;

    const history = demoRead(DEMO_ORDERS_KEY) || [];
    history.push({transaction_id: transactionId, value: total, currency: "EUR", item_count: cart.length});
    localStorage.setItem(DEMO_ORDERS_KEY, JSON.stringify(history));

    pushEcommerce("add_payment_info", {
        currency: "EUR",
        value: total,
        coupon: hasDiscount ? DEMO_CODE : undefined,
        payment_type: paymentType,
        items
    });
    pushEcommerce("purchase", {
        transaction_id: transactionId,
        value: total,
        currency: "EUR",
        coupon: hasDiscount ? DEMO_CODE : undefined,
        discount: Math.round((subtotal - total) * 100) / 100,
        shipping_tier: shippingTier,
        items
    });

    const message = document.getElementById("purchase-message");
    message.replaceChildren();
    const heading = document.createElement("h2");
    heading.textContent = "Purchase Successful!";
    const orderText = document.createElement("p");
    orderText.textContent = `Order ID: ${transactionId}`;
    const totalText = document.createElement("p");
    totalText.textContent = `Total: €${total.toFixed(2)}`;
    message.append(heading, orderText, totalText);
    message.classList.remove("hidden");

    cart = [];
    localStorage.removeItem(DEMO_DISCOUNT_KEY);
    placeBtn.disabled = false;
    updateCart();
}

// ---- Product list / item / cart views ----
function observeOnce(el, threshold, callback) {
    if (!el || !("IntersectionObserver" in window)) return;
    new IntersectionObserver((entries, obs) => {
        if (entries.some(e => e.isIntersecting)) callback(obs);
    }, {threshold}).observe(el);
}

observeOnce(document.getElementById("products"), 0.3, obs => {
    obs.disconnect();
    pushEcommerce("view_item_list", {
        ...LIST,
        items: Object.keys(PRODUCTS).map((id, i) => ({...ga4Item(id, 1, i), ...LIST}))
    });
});

document.querySelectorAll(".product[data-product-id]").forEach(el => {
    el.addEventListener("click", event => {
        if (event.target.closest("button")) return;
        const id = el.dataset.productId;
        pushEcommerce("select_item", {...LIST, items: [{...ga4Item(id), ...LIST}]});
    });
});

if ("IntersectionObserver" in window) {
    new IntersectionObserver(entries => {
        if (!entries.some(e => e.isIntersecting) || cart.length === 0) return;
        const signature = cart.map(p => p.id).sort().join(",");
        if (signature === viewedCartSignature) return;
        viewedCartSignature = signature;
        pushEcommerce("view_cart", {currency: "EUR", value: cartPayable(), items: cartItems()});
    }, {threshold: 0.3}).observe(document.getElementById("cart-section"));
}

document.getElementById("checkout-btn").addEventListener("click", beginCheckout);
document.getElementById("to-payment").addEventListener("click", submitShipping);
document.getElementById("place-order-btn").addEventListener("click", completePurchase);



const CONSENT_KEY = "demoshop_consent_v1";

const cookieBanner = document.getElementById("cookie-banner");
const cookieSettings = document.getElementById("cookie-settings");

const analyticsCheckbox =
    document.getElementById("consent-analytics");

const marketingCheckbox =
    document.getElementById("consent-marketing");

function updateConsent(analytics, marketing) {
    if (typeof gtag === "function") {
        gtag("consent", "update", {
            analytics_storage: analytics ? "granted" : "denied",
            ad_storage: marketing ? "granted" : "denied",
            ad_user_data: marketing ? "granted" : "denied",
            ad_personalization: marketing ? "granted" : "denied"
        });
    }
}

function saveConsent(analytics, marketing) {
    const preferences = {
        analytics: Boolean(analytics),
        marketing: Boolean(marketing)
    };

    localStorage.setItem(
        CONSENT_KEY,
        JSON.stringify(preferences)
    );

    updateConsent(
        preferences.analytics,
        preferences.marketing
    );

    cookieBanner.classList.add("hidden");
    cookieSettings.classList.add("hidden");
    document.getElementById("save-cookies").classList.add("hidden");
    document.getElementById("customize-cookies").classList.remove("hidden");
}

function openCookieSettings() {
    const saved = readConsent();

    analyticsCheckbox.checked = saved?.analytics ?? false;
    marketingCheckbox.checked = saved?.marketing ?? false;

    cookieBanner.classList.remove("hidden");
    cookieSettings.classList.remove("hidden");

    document.getElementById("save-cookies")
        .classList.remove("hidden");
    document.getElementById("customize-cookies")
        .classList.add("hidden");
}

function readConsent() {
    try {
        const raw = localStorage.getItem(CONSENT_KEY);
        if (!raw) return null;

        const saved = JSON.parse(raw);

        if (
            typeof saved.analytics !== "boolean" ||
            typeof saved.marketing !== "boolean"
        ) {
            return null;
        }

        return saved;
    } catch {
        return null;
    }
}

const storedConsent = readConsent();

if (!storedConsent) {
    cookieBanner.classList.remove("hidden");
}

document.getElementById("accept-cookies")
    .addEventListener("click", () => {
        saveConsent(true, true);
    });

document.getElementById("reject-cookies")
    .addEventListener("click", () => {
        saveConsent(false, false);
    });

document.getElementById("customize-cookies")
    .addEventListener("click", openCookieSettings);

document.getElementById("save-cookies")
    .addEventListener("click", () => {
        saveConsent(
            analyticsCheckbox.checked,
            marketingCheckbox.checked
        );
    });

document.getElementById("privacy-settings")
    .addEventListener("click", openCookieSettings);



const demoControls =
    document.getElementById("demo-controls");

const isLocalDemo = ["localhost", "127.0.0.1"]
    .includes(window.location.hostname)
    || new URLSearchParams(window.location.search).has("demo");

document.addEventListener("keydown", (event) => {
    if (
        isLocalDemo &&
        event.ctrlKey &&
        event.shiftKey &&
        event.key.toLowerCase() === "d"
    ) {
        event.preventDefault();
        demoControls.classList.toggle("hidden");
    }
});

document.getElementById("close-demo-controls")
    .addEventListener("click", () => {
        demoControls.classList.add("hidden");
    });

document.getElementById("reset-demo")
    .addEventListener("click", () => {

        const resetConsent =
            document.getElementById("reset-consent").checked;

        const resetCart =
            document.getElementById("reset-cart").checked;

        const resetAccounts =
            document.getElementById("reset-accounts").checked;

        const resetOrders =
            document.getElementById("reset-orders").checked;

        if (!confirm(
            "Reset the selected fictional demo data?"
        )) {
            return;
        }

        if (resetConsent) {
            localStorage.removeItem("demoshop_consent_v1");
        }

        if (resetCart) {
            localStorage.removeItem(DEMO_DISCOUNT_KEY);
            cart.length = 0;
            updateCart();
        }

        if (resetAccounts) {
            localStorage.removeItem("demoshop_demo_account");
            localStorage.removeItem(DEMO_DISCOUNT_KEY);
            localStorage.removeItem("demoshop_newsletter");
        }

        if (resetOrders) {
            localStorage.removeItem("demoshop_order_history");
        }

        window.location.reload();
    });

function refreshAccount() {
    const account = demoRead(DEMO_ACCOUNT_KEY);
    const target = document.getElementById("account-status");
    target.textContent = account ? `Signed in as ${account.name} (fictional demo profile). Newsletter: ${account.newsletter ? "opted in" : "not opted in"}.` : "No demo account created.";
}

document.getElementById("newsletter-form").addEventListener("submit", event => {
    event.preventDefault();
    if (!document.getElementById("newsletter-optin").checked) return;
    const email = document.getElementById("newsletter-email").value.trim();
    if (!email) return;
    localStorage.setItem(DEMO_NEWSLETTER_KEY, JSON.stringify({subscribed: true}));
    localStorage.setItem(DEMO_DISCOUNT_KEY, DEMO_CODE);
    document.getElementById("newsletter-result").textContent = "Subscribed in demo mode! Your code: WELCOME10";
    demoEmit("newsletter_signup", {method: "demo_form", consent_newsletter: true});
    demoEmit("generate_lead", {lead_source: "newsletter_demo"});
    document.getElementById("newsletter-form").reset();
    updateCart();
});

document.getElementById("account-form").addEventListener("submit", event => {
    event.preventDefault();
    const name = document.getElementById("account-name").value.trim();
    const email = document.getElementById("account-email").value.trim();
    const address = document.getElementById("account-address").value.trim();
    const newsletter = document.getElementById("account-newsletter").checked;
    if (!name || !email) return;
    localStorage.setItem(DEMO_ACCOUNT_KEY, JSON.stringify({name, newsletter, has_demo_address: Boolean(address)}));
    if (newsletter) {
        localStorage.setItem(DEMO_NEWSLETTER_KEY, JSON.stringify({subscribed: true}));
        localStorage.setItem(DEMO_DISCOUNT_KEY, DEMO_CODE);
        demoEmit("newsletter_signup", {method: "registration_demo", consent_newsletter: true});
    }
    demoEmit("sign_up", {method: "demo_account"});
    document.getElementById("account-result").textContent = newsletter ? "Demo account created. WELCOME10 unlocked!" : "Demo account created!";
    document.getElementById("account-form").reset();
    refreshAccount();
    updateCart();
});

document.getElementById("logout-demo").addEventListener("click", () => {
    localStorage.removeItem(DEMO_ACCOUNT_KEY);
    refreshAccount();
});

document.getElementById("apply-discount").addEventListener("click", () => {
    const entered = document.getElementById("discount-code").value.trim().toUpperCase();
    const eligible = Boolean(demoRead(DEMO_NEWSLETTER_KEY)?.subscribed);
    if (entered === DEMO_CODE && eligible) {
        localStorage.setItem(DEMO_DISCOUNT_KEY, DEMO_CODE);
        demoEmit("demo_coupon_applied", {coupon: DEMO_CODE});
    } else {
        document.getElementById("discount-status").textContent = "Subscribe to the demo newsletter to unlock WELCOME10.";
        return;
    }
    updateCart();
});
refreshAccount();
updateCart();
