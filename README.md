# 🚀 GM University BCA Blogging Platform

## 📚 1. Project Overview and Purpose

The GM University BCA Blogging Platform is a dynamic and interactive multi-page website designed to provide an engaging and user-friendly space for students and faculty of the BCA department to share knowledge, insights, and updates. Originally a static website, it has been enhanced with JavaScript to create a more modern and responsive user experience.

The purpose of this platform is to:
- 🤝 Foster a sense of community within the BCA department.
- ✍️ Provide a platform for students to showcase their technical writing skills.
- 📅 Share information about events, projects, and academic achievements.
- 💡 Serve as a practical example of web development best practices.

## 🛠️ 2. Installation Instructions

To set up the project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/gm-university-blog.git
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd gm-university-blog
    ```

3.  **Open `index.html` in your browser:**
    No special servers are needed. Simply open the `index.html` file in a modern web browser like Chrome, Firefox, or Edge to view the website.

## ⚙️ 3. Configuration Requirements

This project is built with static HTML, CSS, and JavaScript and does not require any special configuration or environment setup.

-   **🌐 Web Browser**: A modern web browser that supports ES6 JavaScript is all that is needed.
-   **📦 Dependencies**: There are no external libraries or frameworks, so no package installation is necessary.

## 📝 4. Usage Examples

The website includes several dynamic features powered by JavaScript.

### ✨ Dynamic Welcome Message
A welcome message is displayed on the homepage, which changes based on the time of day (e.g., "Good Morning," "Good Afternoon," "Good Evening").

### 🎨 Interactive Content Filters
On the homepage and features page, users can filter content by category.

```html
<!-- Filter Buttons -->
<div class="filters">
    <button onclick="filterContent('all')">All</button>
    <button onclick="filterContent('Programming')">Programming</button>
    <button onclick="filterContent('Web Development')">Web Development</button>
    <button onclick="filterContent('Database')">Database</button>
</div>

<!-- Content Cards with Category Classes -->
<div class="card Programming">
    <h3>Blog Post Title</h3>
    <p>Content about programming...</p>
</div>
```

### 🐛 Real-Time Form Validation
The contact form provides real-time validation feedback for the name, email, and phone number fields.

```javascript
// from scripts.js
function validateField(field, regex, errorElement) {
    if (!regex.test(field.value)) {
        errorElement.textContent = "Invalid format.";
        return false;
    } else {
        errorElement.textContent = "";
        return true;
    }
}
```

### 📅 Dynamic Footer
The footer of each page dynamically displays the current year and the date the page was last modified.

```html
<!-- Footer with Dynamic Spans -->
<p>&copy; <span id="footer-year"></span> GM University BCA | All Rights Reserved | Last Modified: <span id="last-modified"></span></p>
```

## 🙌 5. Contribution Guidelines

We welcome contributions to the GM University BCA Blogging Platform. To contribute, please follow these steps:

1.  **Fork the repository.**
2.  **Create a new branch** for your feature or bug fix:
    ```bash
    git checkout -b feature-name
    ```
3.  **Make your changes** and ensure they follow the existing code style.
4.  **Test your changes** thoroughly.
5.  **Submit a pull request** with a clear description of your changes.

## 📜 6. License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

*(Note: A `LICENSE` file should be added to the repository.)*

## 📊 7. Current Project Status and Version

-   **Version**: 2.0.0
-   **Status**: Active 🟢
-   **Last Updated**: 2024-07-26

This version includes the initial static website and the new dynamic JavaScript features. The platform is stable and in use.
