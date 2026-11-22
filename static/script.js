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


function addToCart(productId, price) {

    const product = {
        id: productId,
        price: price
    };

    cart.push(product);

    const productName = productId === "headphones" ? "Wireless Headphones" : productId === "smartwatch" ? "Smart Watch" : productId;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ecommerce: null});
    demoEmit("add_to_cart", {
        ecommerce: {
            currency: "EUR",
            value: price,
            items: [{item_id: productId, item_name: productName, price: price, quantity: 1}]
        }
    });

    document.getElementById("purchase-message").classList.add("hidden");

    console.log("Product added:", product);

    updateCart();
}

function removeFromCart(index) {

    const removedProduct = cart.splice(index, 1)[0];

    console.log("Product removed:", removedProduct);

    updateCart();
}

function updateCart() {

    const cartElement = document.getElementById("cart");
    const totalElement = document.getElementById("cart-total");
    const checkoutButton = document.getElementById("checkout-btn");

    cartElement.innerHTML = "";

    if (cart.length === 0) {
        cartElement.textContent = "Your cart is empty.";
    } else {

        const list = document.createElement("ul");

        cart.forEach((product, index) => {

            const item = document.createElement("li");

            const productText = document.createElement("span");
            productText.textContent =
                `${product.id} - €${product.price.toFixed(2)} `;

            const removeButton = document.createElement("button");
            removeButton.textContent = "Remove";

            removeButton.onclick = function() {
                removeFromCart(index);
            };

            item.appendChild(productText);
            item.appendChild(removeButton);
            list.appendChild(item);
        });

        cartElement.appendChild(list);
    }

    const total = cart.reduce(
        (sum, product) => sum + product.price, 0
    );

    totalElement.textContent = total.toFixed(2);
    document.getElementById("discounted-total").textContent = cartPayable().toFixed(2);
    document.getElementById("discount-status").textContent = discountActive() ? "WELCOME10 applied · 10% off" : "";

    checkoutButton.disabled = cart.length === 0;
}

function completePurchase() {
    if (cart.length === 0) return;

    const checkoutButton = document.getElementById("checkout-btn");
    checkoutButton.disabled = true;
    const subtotal = Math.round(cartSubtotal() * 100) / 100;
    const hasDiscount = discountActive();
    const total = cartPayable();
    const transactionId = "DEMO-" + crypto.randomUUID();
    const quantities = new Map();

    for (const product of cart) {
        const current = quantities.get(product.id) || {item_id: product.id, item_name: product.id === "headphones" ? "Wireless Headphones" : product.id === "smartwatch" ? "Smart Watch" : product.id, price: product.price, quantity: 0};
        current.quantity += 1;
        quantities.set(product.id, current);
    }

    const items = Array.from(quantities.values());
    const ecommerce = {
        transaction_id: transactionId,
        value: total,
        currency: "EUR",
        coupon: hasDiscount ? DEMO_CODE : undefined,
        discount: Math.round((subtotal - total) * 100) / 100,
        items
    };

    const history = demoRead(DEMO_ORDERS_KEY) || [];
    history.push({transaction_id: transactionId, value: total, currency: "EUR", item_count: cart.length});
    localStorage.setItem(DEMO_ORDERS_KEY, JSON.stringify(history));

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ecommerce: null});
    demoEmit("begin_checkout", {ecommerce: {currency: "EUR", value: total, items}});
    window.dataLayer.push({ecommerce: null});
    demoEmit("purchase", {ecommerce});

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
    updateCart();
}



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
}

function openCookieSettings() {
    const saved = readConsent();

    analyticsCheckbox.checked = saved?.analytics ?? false;
    marketingCheckbox.checked = saved?.marketing ?? false;

    cookieBanner.classList.remove("hidden");
    cookieSettings.classList.remove("hidden");

    document.getElementById("save-cookies")
        .classList.remove("hidden");
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

if (storedConsent) {
    updateConsent(
        storedConsent.analytics,
        storedConsent.marketing
    );
} else {
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
    .includes(window.location.hostname);

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
