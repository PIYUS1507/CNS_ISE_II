# Firewall Simulation System

A simple, interactive web-based simulator designed to demonstrate how firewalls protect networks by filtering traffic based on user-defined rules. 

This project was built to help users understand the core concepts of stateless packet filtering, rule evaluation order, and network traffic monitoring.

## 🚀 Features

*   **Interactive Visualizer:** Watch packets travel from the "Internet" to the "Local Network" and see them get either allowed or visually blocked at the firewall.
*   **Dynamic Rule Engine:** Add, remove, and manage firewall rules on the fly. Rules support:
    *   Source and Destination IP addresses (including `*` for any).
    *   Specific Ports (e.g., `80`, `443`, `22`).
    *   Protocols (`TCP`, `UDP`, `ICMP`).
    *   Actions (`ALLOW` or `DENY`).
*   **Traffic Generator:** Manually craft custom packets to test specific rules, or use the "Send Random Traffic" feature to simulate a live network load.
*   **Live Traffic Logs:** A real-time console that records the outcome of every packet evaluated by the firewall, making it easy to monitor what is being blocked or allowed.
*   **Default Deny Policy:** Demonstrates the standard security practice where any traffic not explicitly allowed by a rule is automatically dropped.

## 🛠️ Technology Stack

This project is built purely with frontend technologies, requiring no backend or complex setup:
*   **HTML5**
*   **CSS3** (with custom variables and keyframe animations)
*   **Vanilla JavaScript** (ES6+)

## 💻 How to Run

Because this is a simple static application, there are no dependencies to install or servers to configure.

1. Clone or download this repository.
2. Navigate to the `firewall-sim` directory.
3. Double-click the `index.html` file to open it in your default web browser.

## 🧪 How to Use

1. **Observe Default Rules:** When you open the app, there are a few default rules pre-loaded.
2. **Send Traffic:** Click "Send Random Traffic" to see packets being generated. Watch the animation and the live logs.
3. **Add a Rule:** Use the form on the bottom left to create a new rule. For example, to block all web traffic, add a rule with Dest Port `80` and Action `DENY`.
4. **Test Your Rule:** Use the "Send Packet" form to manually send a packet on port `80` and verify that it gets blocked by your new rule.

## 📁 Project Structure

```text
firewall-sim/
├── index.html   # Main layout and structure
├── style.css    # Styling, dark mode theme, and packet animations
└── script.js    # Rule evaluation logic and DOM manipulation
```
