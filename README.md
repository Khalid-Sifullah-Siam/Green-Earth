# Green Earth

Green Earth is a responsive, front-end tree marketplace and awareness website built with HTML, Tailwind CSS, DaisyUI, and vanilla JavaScript. It lets users browse trees by category, search and sort products, view plant details in a modal, manage a shopping cart, and send a contact message.

## Overview

This project focuses on creating a polished, user-friendly experience for a sustainable shopping concept. It uses a public API to load tree categories and plant listings dynamically, so the catalog can be updated without changing the UI code.

## Features

- Responsive landing page with a clean, nature-inspired design
- Dynamic category loading from an external API
- Product browsing with search and sort controls
- Product details modal for each tree
- Client-side cart with quantity controls and subtotal calculation
- Checkout flow with a success message
- Simple contact form interaction
- Smooth scrolling and lightweight UI animations from Tailwind/DaisyUI components

## Tech Stack

- HTML5
- CSS3
- Tailwind CSS
- DaisyUI
- Vanilla JavaScript
- Fetch API

## Project Structure

```text
Green-Earth/
|-- assets/
|   |-- about.png
|   |-- hero-leaf1.png
|   `-- hero-leaf2.png
|-- script/
|   `-- script.js
|-- style/
|   `-- style.css
|-- index.html
|-- Green-Earth.fig
`-- README.md
```

## Getting Started

### Prerequisites

- A modern web browser
- A local static server is recommended for the best experience

> Opening the project with `file://` may block API requests in some browsers. Use a local server instead.

### Run Locally

1. Clone the repository:

   ```bash
   git clone https://github.com/Khalid-Sifullah-Siam/Green-Earth
   cd Green-Earth
   ```

2. Start a local server using any of the following options:

   - VS Code Live Server
   - Python:

     ```bash
     python -m http.server 8000
     ```

   - Node.js:

     ```bash
     npx serve .
     ```

3. Open the site in your browser:

   ```text
   http://localhost:8000
   ```

## API Endpoints

Green Earth uses the Programming Hero public API:

- `GET https://openapi.programming-hero.com/api/categories`
- `GET https://openapi.programming-hero.com/api/plants`
- `GET https://openapi.programming-hero.com/api/category/{id}`
- `GET https://openapi.programming-hero.com/api/plant/{id}`

### Example Usage

- Load all categories to build the filter sidebar
- Load all plants to show the main product grid
- Load plants by category when a category button is selected
- Load a single plant to show details in the modal

## How It Works

- Categories are fetched on page load and rendered as filter buttons.
- Plants are fetched and displayed in a responsive grid.
- Search filters the visible products by name or category.
- Sort options reorder products by name or price.
- Cart actions update the item count, subtotal, and total price in real time.
- Checkout clears the cart and shows a success alert.

## Notes

- The contact form is front-end only and displays a confirmation message after submission.
- Cart data is stored in memory, so it resets on refresh.
- The included `Green-Earth.fig` file is the Figma design source for the project.

## Future Improvements

- Persist cart data in local storage
- Add form validation and backend submission for the contact form
- Introduce a real checkout flow
- Add reusable components and a build system if the project grows

## License

No license has been specified yet. Add one if you plan to share or distribute the project publicly.
