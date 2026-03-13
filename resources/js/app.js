import "./bootstrap";

import Alpine from "alpinejs";

window.Alpine = Alpine;

Alpine.start();

import { initDashboard } from "./messages/dashboard.js";

document.addEventListener("DOMContentLoaded", initDashboard);
