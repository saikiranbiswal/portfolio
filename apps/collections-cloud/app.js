const customers = {
  maya: { name: "Maya Patel", avatar: "MP", balance: "$8,420", dpd: "18 days", action: "Call now", reason: "High contact likelihood in the next 45 minutes." },
  daniel: { name: "Daniel Kim", avatar: "DK", balance: "$4,185", dpd: "12 days", action: "Offer an affordable plan", reason: "Temporary income disruption detected with strong plan eligibility." },
  olivia: { name: "Olivia Roberts", avatar: "OR", balance: "$12,640", dpd: "28 days", action: "Review before contact", reason: "Vulnerability signal requires specialist review before outreach." }
};

const modalContent = {
  call: ["Guided call", "Call Maya Patel", '<div class="modal-call"><span>Ready to call</span><strong>+1 (415) 555-0184</strong><span>Compliant contact window open until 9:00 PM</span></div><label>Call objective<select><option>Confirm promise due today</option><option>Offer payment plan</option><option>Discuss hardship support</option></select></label>'],
  message: ["Compliant outreach", "Send a message", '<p>The approved template uses the customer preferred channel and respects consent and contact-frequency policies.</p><label>Template<select><option>Promise reminder with secure payment link</option><option>Payment plan options</option><option>Request a convenient call time</option></select></label><label>Preview<textarea>Hi Maya, a reminder that your agreed payment is due today. Use your secure link to pay or review flexible options.</textarea></label>'],
  "new-plan": ["Resolution workflow", "Create payment plan", '<p>Build an affordable plan within configured enterprise policy.</p><label>Plan structure<select><option>3 monthly payments</option><option>6 monthly payments</option><option>Custom arrangement</option></select></label><label>First payment<input value="$2,807"></label><label>First payment date<input type="date" value="2026-06-10"></label>'],
  promise: ["Commitment workflow", "Record promise to pay", '<label>Promise amount<input value="$1,250"></label><label>Promise date<input type="date" value="2026-06-10"></label><label>Payment method<select><option>ACH ending 4028</option><option>Debit card</option><option>Customer will pay manually</option></select></label>'],
  "offer-plan": ["Resolution workflow", "Offer recommended plan", '<p>This plan is within affordability and approval policy. Sending it creates a secure self-service link and records the treatment decision.</p><div class="modal-call"><span>Recommended plan</span><strong>3 x $2,807</strong><span>First payment today, then every 30 days</span></div>'],
  note: ["Account record", "Add case note", '<label>Note<textarea placeholder="Add context for the next person working this account..."></textarea></label><label>Outcome<select><option>General note</option><option>Customer contact</option><option>Hardship information</option><option>Dispute</option></select></label>'],
  complete: ["Workflow", "Complete next action", '<p>Choose the outcome to update the account journey, queue, and reporting.</p><label>Outcome<select><option>Promise confirmed</option><option>Payment completed</option><option>Plan offered</option><option>No answer</option><option>Specialist review required</option></select></label><label>Follow-up<textarea placeholder="Optional follow-up note"></textarea></label>'],
  simulate: ["Strategy Studio", "Simulate strategy changes", '<p>Run proposed changes against the last 90 days of portfolio behavior before publishing.</p><label>Population<select><option>All eligible retail accounts</option><option>10% representative sample</option><option>Current early-collections queue</option></select></label><label>Primary success metric<select><option>Net recovery</option><option>Self-cure rate</option><option>Promise kept rate</option></select></label>'],
  publish: ["Strategy Studio", "Publish journey changes", '<p>Publishing creates a governed version, records your approval, and applies changes to new strategy decisions.</p><label>Change summary<textarea placeholder="Describe the reason for this change..."></textarea></label><label>Activation<select><option>Immediately after approval</option><option>Schedule activation</option></select></label>'],
  "edit-node": ["Strategy Studio", "Configure AI decision", '<p>Control the signals and guardrails used to choose the next-best treatment.</p><label>Optimization goal<select><option>Customer resolution</option><option>Net recovery</option><option>Digital self-service</option></select></label><label>Human review threshold<select><option>Vulnerability and low confidence</option><option>All low-confidence decisions</option></select></label>'],
  configure: ["Administration", "Configure capability", '<p>This capability is connected to live journeys. Saved changes are versioned and written to the audit log.</p><label>Configuration name<input value="North America Retail default"></label><label>Approval policy<select><option>Two-person approval required</option><option>Administrator approval</option></select></label><label>Change note<textarea placeholder="Why is this configuration changing?"></textarea></label>'],
  "save-admin": ["Administration", "Save enterprise configuration", '<p>Your updates will create a new governed configuration version. Connected journeys will use it after approval.</p><label>Change summary<textarea placeholder="Describe these changes..."></textarea></label><label>Approver<select><option>Priya Shah - Compliance lead</option><option>Marcus Lee - Platform owner</option></select></label>'],
  "open-brief": ["Daily brief", "Today in collections", '<p><strong>Three things deserve attention:</strong></p><p>1. Nine late-collections cases are beyond SLA.<br>2. Twelve promises due today show elevated failure risk.<br>3. The pre-due digital expansion could protect an estimated $184K.</p>'],
  filters: ["Queue controls", "Filter priority queue", '<label>Assignment<select><option>My priority accounts</option><option>My team</option><option>All unassigned</option></select></label><label>Stage<select><option>All active stages</option><option>Early collections</option><option>Late collections</option></select></label>'],
  "new-template": ["Communications", "Create message template", '<label>Channel<select><option>SMS</option><option>Email</option><option>WhatsApp</option></select></label><label>Use case<select><option>Payment reminder</option><option>Plan offer</option><option>Promise confirmation</option></select></label><label>Message<textarea placeholder="Write a compliant message..."></textarea></label>']
};

const views = document.querySelectorAll(".view");
const navItems = document.querySelectorAll(".nav-item");
const sidebar = document.getElementById("sidebar");
const navBackdrop = document.getElementById("navBackdrop");
const drawer = document.getElementById("customerDrawer");
const drawerBackdrop = document.getElementById("drawerBackdrop");
const modal = document.getElementById("actionModal");
const modalBackdrop = document.getElementById("modalBackdrop");
const toast = document.getElementById("toast");

function showView(name) {
  views.forEach(view => view.classList.toggle("active", view.id === `view-${name}`));
  navItems.forEach(item => item.classList.toggle("active", item.dataset.view === name));
  sidebar.classList.remove("open");
  navBackdrop.classList.remove("open");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function openCustomer(id) {
  const customer = customers[id] || customers.maya;
  document.getElementById("drawerName").textContent = customer.name;
  document.getElementById("drawerAvatar").textContent = customer.avatar;
  document.getElementById("drawerBalance").textContent = customer.balance;
  document.getElementById("drawerDpd").textContent = customer.dpd;
  document.getElementById("drawerAction").textContent = customer.action;
  document.getElementById("drawerReason").textContent = customer.reason;
  drawer.classList.add("open");
  drawerBackdrop.classList.add("open");
  drawer.setAttribute("aria-hidden", "false");
}

function closeCustomer() {
  drawer.classList.remove("open");
  drawerBackdrop.classList.remove("open");
  drawer.setAttribute("aria-hidden", "true");
}

function openModal(action) {
  const content = modalContent[action] || ["Workflow", "Action ready", "<p>This workflow is connected and ready to use.</p>"];
  document.getElementById("modalEyebrow").textContent = content[0];
  document.getElementById("modalTitle").textContent = content[1];
  document.getElementById("modalBody").innerHTML = content[2];
  modal.classList.add("open");
  modalBackdrop.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  modal.classList.remove("open");
  modalBackdrop.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2800);
}

document.addEventListener("click", event => {
  const viewLink = event.target.closest("[data-view-link]");
  const navLink = event.target.closest("[data-view]");
  const customer = event.target.closest("[data-customer]");
  const action = event.target.closest("[data-action]");
  const admin = event.target.closest("[data-admin]");
  const drawerTab = event.target.closest("[data-drawer-tab]");

  if (viewLink) showView(viewLink.dataset.viewLink);
  if (navLink) showView(navLink.dataset.view);
  if (customer) openCustomer(customer.dataset.customer);
  if (action) openModal(action.dataset.action);
  if (admin) {
    document.querySelectorAll("[data-admin]").forEach(button => button.classList.toggle("active", button === admin));
    document.querySelectorAll(".admin-panel").forEach(panel => panel.classList.toggle("active", panel.id === `admin-${admin.dataset.admin}`));
  }
  if (drawerTab) {
    document.querySelectorAll("[data-drawer-tab]").forEach(button => button.classList.toggle("active", button === drawerTab));
    document.querySelectorAll(".drawer-tab").forEach(tab => tab.classList.toggle("active", tab.id === `drawer-${drawerTab.dataset.drawerTab}`));
  }
});

document.getElementById("openNav").addEventListener("click", () => { sidebar.classList.add("open"); navBackdrop.classList.add("open"); });
document.getElementById("closeNav").addEventListener("click", () => { sidebar.classList.remove("open"); navBackdrop.classList.remove("open"); });
navBackdrop.addEventListener("click", () => { sidebar.classList.remove("open"); navBackdrop.classList.remove("open"); });
document.getElementById("closeDrawer").addEventListener("click", closeCustomer);
drawerBackdrop.addEventListener("click", closeCustomer);
document.getElementById("closeModal").addEventListener("click", closeModal);
document.getElementById("cancelModal").addEventListener("click", closeModal);
modalBackdrop.addEventListener("click", closeModal);
document.getElementById("confirmModal").addEventListener("click", () => { closeModal(); showToast("Action completed and customer journey updated."); });

document.querySelectorAll(".switch input").forEach(input => input.addEventListener("change", () => showToast("Channel configuration updated. Save to publish.")));
document.getElementById("customerSearch").addEventListener("keydown", event => { if (event.key === "Enter") openCustomer("maya"); });
document.getElementById("globalSearch").addEventListener("keydown", event => { if (event.key === "Enter" && event.target.value.trim()) openCustomer("maya"); });
document.addEventListener("keydown", event => {
  if (event.key === "/" && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") {
    event.preventDefault();
    document.getElementById("globalSearch").focus();
  }
  if (event.key === "Escape") { closeModal(); closeCustomer(); sidebar.classList.remove("open"); navBackdrop.classList.remove("open"); }
});
