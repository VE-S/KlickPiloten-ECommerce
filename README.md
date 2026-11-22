# DemoShop Studio — E-Commerce Analytics Demo

A fictional e-commerce application built to demonstrate event-based tracking, conversion measurement, and marketing analytics using Google Tag Manager (GTM) and Google Analytics 4 (GA4).

## Project Overview

DemoShop Studio simulates a customer journey through an online store, from browsing products and adding items to a shopping cart to completing a purchase.

The project also includes fictional account registration, newsletter subscriptions, promotional discounts, and cookie consent preferences.

Its main purpose is to demonstrate how technical tracking implementations can support marketing analysis and conversion optimization.

## Technologies

- Python and Flask
- HTML, CSS, and JavaScript
- Google Tag Manager (GTM)
- Google Analytics 4 (GA4)
- JavaScript dataLayer
- Browser localStorage for fictional demo data

## Tracking Events

| Event | Description |
|---|---|
| `add_to_cart` | A product is added to the shopping cart |
| `begin_checkout` | The simulated checkout process begins |
| `purchase` | A fictional purchase is completed |
| `sign_up` | A fictional customer account is created |
| `newsletter_signup` | A visitor explicitly subscribes to the fictional newsletter |
| `generate_lead` | A newsletter form generates a fictional lead |

E-commerce events include relevant information such as product identifiers, prices, currency, and transaction details.

## Features

- Interactive shopping cart
- Simulated checkout and purchases
- Fictional customer registration
- Newsletter opt-in
- Promotional discount code (`WELCOME10`)
- Cookie consent preferences
- GTM event tracking
- GA4 integration

## Run Locally

1. Install Python.
2. Clone or download this repository.
3. Install Flask:

   ```bash
   pip install flask
   ```

4. Start the application:

   ```bash
   python app.py
   ```

5. Open `http://127.0.0.1:5000` in your browser.

## Marketing Analytics Use Cases

The tracking implementation supports analysis of:

- Product engagement and shopping cart activity
- Checkout progression and completed purchases
- Account registrations
- Newsletter conversions
- Promotional campaign engagement

These events provide a foundation for building GA4 reports, conversion analyses, and purchase funnels once sufficient data has been collected.

## Important Notes

This is a fictional demonstration project.

No real purchases, payment transactions, or customer accounts are processed. Demo information is stored locally in the browser.

Google Analytics reporting requires a separately configured GA4 property and GTM container.

## Project Purpose

Created as a practical portfolio project to demonstrate technical implementation skills, analytical thinking, and an understanding of digital marketing measurement.