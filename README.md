# DemoShop Studio — E-Commerce Tracking Demo

A fictional e-commerce website built to demonstrate practical Google Tag Manager (GTM) and Google Analytics 4 (GA4) implementation.

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

**User interaction → JavaScript data layer → Google Tag Manager → Google Analytics 4**

1. A visitor interacts with the website.
2. JavaScript pushes an event and relevant data to the data layer.
3. Google Tag Manager detects the event through a matching trigger.
4. A GA4 event tag sends the information to Google Analytics.
5. Events can be inspected using GTM Preview and GA4 debugging tools.

## Testing and Validation

The tracking implementation has been tested using:

- **Google Tag Manager Preview / Tag Assistant** — To inspect data layer events and verify tag execution.
- **GA4 DebugView** — To inspect incoming analytics events.
- **Chrome Developer Tools** — To inspect analytics network requests and event parameters.

The checkout flow and multiple e-commerce events have been tested locally.

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
- Combining frontend development with marketing analytics
- Using Git and GitHub for version control

## Author

Created as a personal portfolio project to demonstrate web development, marketing analytics, and practical tracking implementation.