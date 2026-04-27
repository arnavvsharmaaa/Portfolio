// ============================================================
//  contact-form.js — Portfolio Contact Form Handler
//  Integrates: Supabase (DB) + EmailJS (notifications)
//
//  ONE-TIME SETUP:
//  1. Run the SQL in SETUP.md inside your Supabase SQL Editor
//  2. Create an EmailJS account, service, and template (see SETUP.md)
//  3. Fill in the CONFIG block below with your real credentials
// ============================================================

const CONFIG = {
  emailjs: {
    publicKey: "82G07x-pOS9otrUhT",   // EmailJS → Account → Public Key
    serviceId: "service_ifoybwp",           // EmailJS → Email Services → Service ID
    templateId: "template_2qxap6n",          // EmailJS → Email Templates → Template ID
  },
  supabase: {
    url: "https://dljvbhvvsqbqnhjakcey.supabase.co",            // Supabase → Project Settings → API → Project URL
    anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRsanZiaHZ2c3FicW5oamFrY2V5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxODQzOTMsImV4cCI6MjA5Mjc2MDM5M30.DMzDKEWscsQQgGdsWPb5FxrWI4-RmFYgbSulm_L5DdU",       // Supabase → Project Settings → API → anon public key
  },
  form: {
    nameField: "#fullName",
    emailField: "#emailAddress",
    subjectField: "#subject",
    messageField: "#message",
    submitBtn: "#submitBtn",
  },
};

// ─── Toast notification helper ────────────────────────────────────────────────
// Creates a small pop-up in the bottom-right corner, auto-dismisses after 4 s.
let activeToast = null;

function showToast(message, type = "success") {
  // Remove any existing toast first
  if (activeToast) {
    activeToast.remove();
    activeToast = null;
  }

  const toast = document.createElement("div");
  toast.textContent = message;

  // Base styles
  Object.assign(toast.style, {
    position: "fixed",
    bottom: "28px",
    right: "28px",
    zIndex: "9999",
    padding: "14px 22px",
    borderRadius: "12px",
    fontSize: "15px",
    fontWeight: "600",
    fontFamily: "-apple-system, 'Segoe UI', Inter, sans-serif",
    color: "#fff",
    boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
    opacity: "1",
    transition: "opacity 0.4s ease",
    background: type === "success" ? "#4f46e5" : "#dc2626",
    maxWidth: "320px",
    lineHeight: "1.4",
  });

  document.body.appendChild(toast);
  activeToast = toast;

  // Auto-dismiss after 4 seconds
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => {
      toast.remove();
      if (activeToast === toast) activeToast = null;
    }, 400);
  }, 4000);
}

// ─── Email validation regex ───────────────────────────────────────────────────
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

// ─── Main initialisation ──────────────────────────────────────────────────────
// Waits for DOM to be ready before attaching listeners.
document.addEventListener("DOMContentLoaded", () => {

  // Grab form elements — uses the CONFIG selectors so owners can adjust easily
  const nameField = document.querySelector(CONFIG.form.nameField);
  const emailField = document.querySelector(CONFIG.form.emailField);
  const subjectField = document.querySelector(CONFIG.form.subjectField);
  const messageField = document.querySelector(CONFIG.form.messageField);
  const submitBtn = document.querySelector(CONFIG.form.submitBtn);

  if (!nameField || !emailField || !messageField || !submitBtn) {
    console.warn("[contact-form.js] Could not find all required form fields. Check CONFIG.form selectors.");
    return;
  }

  // ── Initialise EmailJS ──────────────────────────────────────────────────────
  // emailjs is loaded from CDN in <head> before this script runs
  try {
    emailjs.init({ publicKey: CONFIG.emailjs.publicKey });
  } catch (err) {
    console.error("[contact-form.js] EmailJS init failed:", err);
  }

  // ── Initialise Supabase ─────────────────────────────────────────────────────
  // supabase is loaded from CDN in <head> before this script runs
  let db = null;
  try {
    const { createClient } = supabase;
    db = createClient(CONFIG.supabase.url, CONFIG.supabase.anonKey);
  } catch (err) {
    console.error("[contact-form.js] Supabase init failed:", err);
  }

  // ── Submit handler ──────────────────────────────────────────────────────────
  submitBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const name = nameField.value.trim();
    const email = emailField.value.trim();
    const subject = subjectField ? subjectField.value.trim() : "";
    const message = messageField.value.trim();

    // ── 1. Validation ──────────────────────────────────────────────────────
    if (!name) {
      showToast("Please enter your name.", "error");
      nameField.focus();
      return;
    }
    if (!email) {
      showToast("Please enter your email address.", "error");
      emailField.focus();
      return;
    }
    if (!isValidEmail(email)) {
      showToast("Please enter a valid email address.", "error");
      emailField.focus();
      return;
    }
    if (!message) {
      showToast("Please enter a message before sending.", "error");
      messageField.focus();
      return;
    }

    // ── 2. Disable button while sending ───────────────────────────────────
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";

    try {
      // ── 3a. Save to Supabase ─────────────────────────────────────────────
      if (db) {
        const { error: dbError } = await db.from("contacts").insert({
          name,
          email,
          subject: subject || "(no subject)",
          message,
        });
        if (dbError) {
          // Log but don't block — still try to send email
          console.error("[contact-form.js] Supabase insert error:", dbError.message);
        }
      }

      // ── 3b. Send email via EmailJS ───────────────────────────────────────
      await emailjs.send(
        CONFIG.emailjs.serviceId,
        CONFIG.emailjs.templateId,
        {
          from_name: name,
          from_email: email,
          subject: subject || "(no subject)",
          message: message,
        }
      );

      // ── 4. Success ───────────────────────────────────────────────────────
      showToast("Message sent! I'll get back to you soon 🎉", "success");

      // Reset all fields
      nameField.value = "";
      emailField.value = "";
      if (subjectField) subjectField.value = "";
      messageField.value = "";

      // Re-enable button after 4 s
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }, 4000);

    } catch (err) {
      // ── 5. Error ─────────────────────────────────────────────────────────
      console.error("[contact-form.js] Submission error:", err);
      showToast("Something went wrong. Please try again.", "error");

      // Re-enable button after 3 s
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }, 3000);
    }
  });
});
