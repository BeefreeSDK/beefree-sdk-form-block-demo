# Form Block: Beefree SDK Multi-Form & Builder Integration

This project demonstrates advanced [form block integration options](https://docs.beefree.io/beefree-sdk/forms/form-block) with the Beefree SDK, including:
- Multiple pre-defined forms (Auto Loan, Mortgage, Credit Card)
- A custom form builder
- Secure authentication using a Node.js proxy and Beefree SDK's `loginV2`
- Dynamic form selection and editing via content dialogs and modals

---

## Table of Contents

- [Project Overview](#project-overview)
- [Proxy Server (`proxy-server.js`)](#proxy-server)
- [HTML Example Files](#html-example-files)
  - [default-form-example.html](#default-form-examplehtml)
  - [form-library-example.html](#form-library-examplehtml)
  - [form-builder-example.html](#form-builder-examplehtml)
- [Core Concepts](#core-concepts)
  - [Form Implementation & Structure](#form-implementation--structure)
  - [Form Validation](#form-validation)
  - [Content Dialogs & Dynamic Form Selection](#content-dialogs--dynamic-form-selection)
  - [loginV2 Authentication Flow](#loginv2-authentication-flow)
- [How to Use](#how-to-use)
- [Troubleshooting](#troubleshooting)

---

## Project Overview

This project provides a robust example of how to:
- Integrate multiple forms with Beefree SDK
- Allow users to select or build forms dynamically
- Securely authenticate with Beefree SDK using a backend proxy and environment variables
- Understand and extend the Beefree SDK's content dialog and form management features

---

## Proxy Server

**File:** `proxy-server.js`

This Node.js Express server acts as a secure proxy for authenticating with Beefree SDK using the `loginV2` endpoint. It keeps your credentials safe by loading them from a `.env` file and only exposing a `/proxy/bee-auth` endpoint that takes a `uid`.

**Key Features:**
- Loads `BEE_CLIENT_ID` , `BEE_CLIENT_SECRET` , `uid` and from `.env`
- Forwards the request to Beefree SDK's `loginV2` endpoint and returns the token
- Includes a `/proxy/health` endpoint for health checks

**Example .env:**
```
BEE_CLIENT_ID=your-client-id-here
BEE_CLIENT_SECRET=your-client-secret-here
uid= 'uid-here'
```

**Sample Endpoint:**
```js
app.post('/proxy/bee-auth', async (req, res) => {
  try {
    const { uid } = req.body;
    const response = await axios.post(
      'https://auth.getbee.io/loginV2',
      {
        client_id: process.env.BEE_CLIENT_ID,
        client_secret: process.env.BEE_CLIENT_SECRET,
        uid: uid || 'demo-user'
      },
      { headers: { 'Content-Type': 'application/json' } }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to authenticate' });
  }
});
```

---

## HTML Example Files

### `default-form-example.html`

- **Purpose:** Demonstrates loading a single, pre-defined form (Auto Loan Pre-Approval) into the Beefree SDK.
- **Features:** 
  - Loads a default form structure
  - Allows template loading and test email sending
  - Handles authentication via the proxy server
  - Shows how to configure `beeConfig` for a static form

---

### `form-library-example.html`

- **Purpose:** Demonstrates a library of multiple pre-defined forms (Auto Loan, Mortgage, Credit Card) and allows the user to select which form to edit via a modal.
- **Features:**
  - Modal for form selection
  - Dynamic loading of different form structures
  - Uses `contentDialog` and a custom handler for form selection
  - Secure authentication via the proxy server

---

### `form-builder-example.html`

- **Purpose:** Demonstrates a custom form builder UI that lets users dynamically add fields, preview the form, and save it to the Beefree SDK for further editing.
- **Features:**
  - Modal-based form builder with field type buttons
  - Live form preview
  - Schema validation for the form structure
  - Integration with Beefree SDK's `manageForm` content dialog
  - Secure authentication via the proxy server

---

## Core Concepts

### Form Implementation & Structure

Each form is defined as a JavaScript object with a `structure` property, which includes:
- `title` and `description`
- `fields`: An object where each key is a field ID and the value is a field definition (type, label, attributes, options, etc.)
- `layout`: A 2D array specifying the order and grouping of fields
- `attributes`: Form-level attributes (e.g., `action`, `method`, `enctype`)

**Example:**
```js
const autoLoanForm = {
  structure: {
    title: 'Auto Loan Pre-Approval',
    description: 'Check if you\'re pre-approved for an auto loan.',
    fields: {
      full_name: {
        type: 'text',
        label: 'Full Name *',
        attributes: { required: true, placeholder: 'Enter your full name' }
      },
      // ...more fields
    },
    layout: [
      ['full_name'],
      // ...more fields
    ],
    attributes: {
      action: 'http://example.com/read-form-script',
      method: 'post'
    }
  }
};
```

---

### Form Validation

- **Field-level validation:** Each field can specify attributes like `required`, `min`, `max`, `pattern`, etc.
- **Schema validation:** The form builder ensures the structure matches the expected schema before saving/loading into Beefree SDK.

---

### Content Dialogs & Dynamic Form Selection

- **contentDialog:** A Beefree SDK configuration object that allows you to define custom dialogs for managing forms, merge tags, special links, etc.
- **manageForm handler:** Opens a modal for the user to select or build a form, then loads the selected structure into the editor.
- **Modal pattern:** Used for both form selection (library) and form building (builder example).

**Example:**
```js
contentDialog: {
  manageForm: {
    label: 'Edit Form',
    handler: async (resolve, reject, args) => {
      openModal();
      await new Promise((res) => {
        window.selectForm = (formType) => {
          // ...select and resolve form structure
        };
      });
    }
  }
}
```

---

## How to Use

### Prerequisites

- Node.js and npm installed
- Beefree SDK credentials

### Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/BeefreeSDK/beefree-sdk-form-block-demo.git
   cd form-block
   ```

2. **Create a `.env` file:**
   ```
   BEE_CLIENT_ID=your-client-id-here
   BEE_CLIENT_SECRET=your-client-secret-here
   uid=demo-user
   ```

3. **Install dependencies and start the proxy server:**
   ```bash
   npm install express cors axios dotenv
   node proxy-server.js
   ```

4. **Open any of the HTML files in your browser:**
   - `default-form-example.html`
   - `form-library-example.html`
   - `form-builder-example.html`

---

## Troubleshooting

- **Authentication errors:** Ensure your `.env` file is correct and the proxy server is running.
- **Form not loading:** Check the browser console for errors and ensure the form structure matches the schema.
- **Fields not appearing:** Verify that the form structure and layout are being updated correctly.

---
