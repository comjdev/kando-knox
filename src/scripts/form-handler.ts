/**
 * Handles form submissions for trial and contact forms.
 * Sends data to Lambda API endpoints and shows success/error feedback.
 */

const TRIAL_API_URL = import.meta.env.PUBLIC_TRIAL_API_URL || "";
const CONTACT_API_URL = import.meta.env.PUBLIC_CONTACT_API_URL || "";

function getFormData(form: HTMLFormElement): Record<string, string> {
  const data: Record<string, string> = {};
  const formData = new FormData(form);
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") data[key] = value;
  }
  return data;
}

function showMessage(container: HTMLElement, message: string, isError: boolean) {
  const existing = container.querySelector(".form-feedback");
  if (existing) existing.remove();

  const el = document.createElement("div");
  el.className = `form-feedback mt-4 p-4 rounded-lg text-sm ${
    isError ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
  }`;
  el.textContent = message;
  container.appendChild(el);

  setTimeout(() => el.remove(), 8000);
}

async function handleSubmit(e: Event, form: HTMLFormElement, apiUrl: string, formType: string) {
  e.preventDefault();
  const submitBtn = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  const originalText = submitBtn?.textContent;

  if (!apiUrl) {
    showMessage(form, "Form is not configured. Please contact us directly at knox@kandomartialarts.com.au", true);
    return;
  }

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";
  }

  const data = getFormData(form);

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json().catch(() => ({}));

    if (res.ok && json.success) {
      showMessage(form, json.message || "Thank you! We'll be in touch soon.", false);
      form.reset();
    } else {
      showMessage(form, json.error || `Failed to submit. Please try again or contact us directly.`, true);
    }
  } catch {
    showMessage(form, "Network error. Please check your connection and try again.", true);
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText || (formType === "trial" ? "Book a Trial" : "Send message");
    }
  }
}

function init() {
  document.querySelectorAll<HTMLFormElement>('form[data-form-type="trial"]').forEach((form) => {
    form.addEventListener("submit", (e) => handleSubmit(e, form, TRIAL_API_URL, "trial"));
  });
  document.querySelectorAll<HTMLFormElement>('form[data-form-type="contact"]').forEach((form) => {
    form.addEventListener("submit", (e) => handleSubmit(e, form, CONTACT_API_URL, "contact"));
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
