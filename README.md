# DemoShop Studio — E-Commerce Tracking Demo

A fictional e-commerce website built to demonstrate practical Google Tag Manager (GTM), Google Analytics 4 (GA4), and Google Ads tracking implementation.

This project combines a Python/Flask web application with event-based analytics tracking, a simulated checkout process, and an interactive shopping experience.

**Project purpose:** Demonstrate how user interactions can be translated into structured analytics events, tested, and used to understand the e-commerce customer journey.

> **Disclaimer:** DemoShop Studio is a portfolio project, not a real online store. No real purchases or payments are processed.

## Features

- Responsive storefront with fictional products
- Interactive shopping cart
- Discount code functionality
- Multi-step demo checkout
- Shipping and payment method selection
- Simulated purchase confirmation with transaction ID
- Newsletter and demo account interactions
- Cookie settings interface
- Event-based e-commerce tracking
- Consent Mode v2 with persistent cookie preferences and consent withdrawal
- Fictional account identifiers for GA4 User-ID tracking
- Google Ads conversion tracking, dynamic remarketing and Enhanced Conversions demo configuration

## Technologies

| Technology | Purpose |
|---|---|
| Python | Application backend |
| Flask | Local web server and template rendering |
| HTML | Website structure |
| CSS | Responsive design and styling |
| JavaScript | Interactive functionality and data layer events |
| Google Tag Manager | Tag and trigger management |
| Google Analytics 4 | Event-based analytics |
| Google Ads | Conversion tracking and remarketing demo configuration |
| Google Consent Mode v2 | Consent-aware tag execution |
| Git & GitHub | Version control and project documentation |

## Analytics Implementation

The website uses JavaScript `dataLayer.push()` calls to communicate user interactions to Google Tag Manager.

GTM processes these events through custom event triggers and GA4 event tags.

### E-Commerce Events

| Event | Description |
|---|---|
| `view_item_list` | Product collection displayed |
| `select_item` | Product selected |
| `add_to_cart` | Product added to shopping cart |
| `remove_from_cart` | Product removed from shopping cart |
| `view_cart` | Shopping cart viewed |
| `begin_checkout` | Checkout process started |
| `add_shipping_info` | Shipping method selected |
| `add_payment_info` | Demo payment method selected |
| `purchase` | Simulated order completed |

### Additional Events

- `newsletter_signup` — Newsletter signup
- `sign_up` — Demo account registration
- `login` — Demo account login
- `consent_analytics` — Analytics consent granted or restored
- `consent_marketing` — Marketing consent granted or restored

### E-Commerce Data

Depending on the event, the data layer includes information such as:

- Product ID and name
- Product category
- Product price and quantity
- Currency (`EUR`)
- Transaction value
- Transaction ID

These values help demonstrate how structured data can support e-commerce analytics.

## Tracking Architecture

**User interaction → JavaScript data layer → Google Tag Manager → Consent checks → GA4 / Google Ads (demo)**

1. A visitor interacts with the website.
2. JavaScript pushes an event and relevant data to the data layer.
3. Google Tag Manager detects the event through a matching trigger.
4. Eligible GA4 tags send analytics events after the required consent checks. Google Ads tags are configured separately with placeholder credentials.
5. Events can be inspected using GTM Preview and GA4 debugging tools.

## Consent Mode v2

The demo uses consent-gated tag execution (a basic Consent Mode approach for the configured tags). Default consent is established before the GTM container loads.

| Consent parameter | Default | Purpose |
|---|---|---|
| `analytics_storage` | Denied | Analytics storage |
| `ad_storage` | Denied | Advertising storage |
| `ad_user_data` | Denied | Sending user data for advertising purposes |
| `ad_personalization` | Denied | Personalized advertising |
| `functionality_storage` | Granted | Website functionality |
| `security_storage` | Granted | Security functionality |

Cookie preferences can be accepted, rejected or changed. Saved preferences are restored on subsequent page loads. After consent updates, the custom events `consent_analytics` and `consent_marketing` initialize the Google Tag and Conversion Linker respectively when the relevant consent is granted.

GA4 event tags require `analytics_storage`. Ads conversion and user-provided data tags require `ad_storage` and `ad_user_data`; remarketing additionally requires `ad_personalization`. The Conversion Linker requires `ad_storage`.

This is a technical demonstration, not a certification of legal or production compliance.

## GA4 User-ID

The demo uses a fictional, non-email account identifier exposed through the `user_id` data layer field. GTM retrieves it using a Data Layer Variable and applies it through Google Tag configuration and shared event settings.

- Anonymous visitors have no account identifier.
- Registration and login make the demo account identifier available.
- Logout clears the active identifier.
- Network request inspection verified the native GA4 `uid` parameter while logged in and its absence or empty value after logout.

User-ID can support cross-session and cross-device analysis when the same account is recognized. Cross-device behavior itself was not tested in this local demo.

## Google Ads Implementation

The saved GTM demonstration version includes conversion tags, a Conversion Linker, dynamic remarketing and a dedicated User-provided Data tag.

| Conversion event | Suggested Google Ads classification |
|---|---|
| `purchase` | Primary |
| `sign_up` | Depends on campaign objectives |
| `add_to_cart` | Secondary |
| `begin_checkout` | Secondary |

Primary and secondary classifications would be configured in a real Google Ads account, not in GTM. Purchase tracking uses transaction ID, value and currency; intermediate shopping events use value and currency where available.

Dynamic remarketing maps e-commerce product IDs to the retail item format using a Custom JavaScript Variable. The product mapping was inspected in Tag Assistant.

### Enhanced Conversions

The demo exposes a fictional email address for eligible purchase and registration events when marketing consent is granted. Real form email addresses are not intended for analytics transmission.

The configured flow is:

1. Data layer field `user_data.email`.
2. Data Layer Variable `DLV - user_data.email`.
3. User-provided Data Variable `UPD - Enhanced Conversions - DEMO`.
4. Dedicated `Google Ads - User-provided Data` setup tag.
5. Tag sequencing before the purchase or sign-up conversion tag.

In a valid Google Ads implementation, Enhanced Conversions uses normalized and SHA-256-hashed first-party customer data to support conversion matching. Hashing, matching and attribution were not verified in this demo.

### Demo limitations

- The Ads conversion ID is intentionally set to `PLATZHALTER`, with placeholder conversion labels.
- No real Google Ads account is connected.
- The User-provided Data setup tag was initiated for purchase and registration in Preview, but remained in progress; the subsequent conversion tags were not observed firing.
- A successful tag status alone does not prove delivery to Google Ads.
- The final interview configuration was saved as a GTM version for Preview, rather than published with invalid Ads credentials.
- Production deployment requires valid account credentials, appropriate consent configuration and end-to-end validation.

## Testing and Validation

The tracking implementation has been tested using:

- **Google Tag Manager Preview / Tag Assistant** — To inspect data layer events and verify tag execution.
- **GA4 DebugView** — To inspect incoming analytics events.
- **Chrome Developer Tools** — To inspect analytics network requests and event parameters.

The checkout flow and multiple e-commerce events have been tested locally.

| Validation | Result |
|---|---|
| GA4 e-commerce and account events | Tested |
| Purchase value, currency and transaction ID in network requests | Verified |
| Six default consent states | Verified |
| Consent acceptance and saved preferences | Verified |
| Consent rejection and withdrawal | Verified for tested tags |
| Purchase and newsletter tags blocked after rejection | Verified |
| Native GA4 User-ID and logout behavior | Verified |
| Remarketing product mapping | Verified in Preview |
| Enhanced Conversions setup tag initiation | Observed; completion unverified |
| Google Ads conversion delivery and attribution | Not verified |

Use GTM Preview with the saved interview version to reproduce the latest tracking configuration.

**Note:** The GitHub repository contains the website source code. The GTM container and GA4 property are managed separately in Google's platforms.

## Running the Project Locally

### Requirements

- Python 3
- Flask

### Setup

Clone the repository:

```bash
git clone https://github.com/VE-S/KlickPiloten-ECommerce.git
cd KlickPiloten-ECommerce
```

Install Flask:

```bash
python -m pip install flask
```

Start the application:

```bash
python app.py
```

Open the following address in your browser:

`http://127.0.0.1:5000`

The application runs locally and is not automatically hosted by GitHub.

## Project Structure

```text
KlickPiloten-ECommerce/
├── app.py
├── templates/
│   └── index.html
├── static/
│   ├── script.js
│   └── style.css
├── .gitignore
└── README.md
```

## Learning Objectives

This project demonstrates practical experience with:

- Implementing event-based web tracking
- Working with the Google Tag Manager data layer
- Configuring GA4 events and triggers
- Tracking the e-commerce customer journey
- Debugging analytics implementations
- Implementing consent-aware tag execution
- Integrating GA4 User-ID
- Configuring Google Ads conversion and remarketing tags
- Understanding Enhanced Conversions and tag sequencing
- Combining frontend development with marketing analytics
- Using Git and GitHub for version control

## Author

Created as a personal portfolio project to demonstrate web development, marketing analytics, and practical tracking implementation.