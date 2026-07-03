import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { Resend } from "resend";

import {
  getContactServiceLabel,
  isValidContactService,
  type ContactFormPayload,
} from "@/lib/contact-data";

export interface ContactSubmissionResult {
  emailSent: boolean;
  stored: boolean;
}

function getSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) return null;

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function getResend(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

export function validateContactPayload(
  body: unknown,
): { ok: true; data: ContactFormPayload } | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Solicitud inválida." };
  }

  const raw = body as Record<string, unknown>;

  if (typeof raw.website === "string" && raw.website.trim().length > 0) {
    return { ok: false, error: "Solicitud rechazada." };
  }

  const name = typeof raw.name === "string" ? raw.name.trim() : "";
  const email = typeof raw.email === "string" ? raw.email.trim() : "";
  const phone =
    typeof raw.phone === "string" ? raw.phone.trim() : undefined;
  const service = typeof raw.service === "string" ? raw.service.trim() : "";
  const message = typeof raw.message === "string" ? raw.message.trim() : "";
  const sourcePage =
    typeof raw.sourcePage === "string" ? raw.sourcePage.trim() : undefined;

  if (name.length < 2) {
    return { ok: false, error: "Ingresa tu nombre completo." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Ingresa un correo electrónico válido." };
  }

  if (message.length < 10) {
    return {
      ok: false,
      error: "Cuéntanos un poco más en el mensaje (mínimo 10 caracteres).",
    };
  }

  if (!isValidContactService(service)) {
    return { ok: false, error: "Selecciona un servicio de interés." };
  }

  return {
    ok: true,
    data: {
      name,
      email,
      phone: phone || undefined,
      service,
      message,
      sourcePage,
    },
  };
}

async function storeLead(data: ContactFormPayload): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return false;

  const { error } = await supabase.from("leads").insert({
    name: data.name,
    email: data.email,
    phone: data.phone ?? null,
    service: data.service,
    message: data.message,
    source_page: data.sourcePage ?? null,
  });

  if (error) {
    console.error("[contact] Supabase insert failed:", error.message);
    return false;
  }

  return true;
}

async function sendLeadEmail(data: ContactFormPayload): Promise<boolean> {
  const resend = getResend();
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL ?? "Mendifly <onboarding@resend.dev>";

  if (!resend || !to) return false;

  const serviceLabel = getContactServiceLabel(data.service);

  const { error } = await resend.emails.send({
    from,
    to: [to],
    replyTo: data.email,
    subject: `Nuevo lead: ${serviceLabel} — ${data.name}`,
    text: [
      "Nuevo contacto desde Mendifly",
      "",
      `Nombre: ${data.name}`,
      `Correo: ${data.email}`,
      `Teléfono: ${data.phone || "No indicado"}`,
      `Servicio: ${serviceLabel}`,
      `Página: ${data.sourcePage || "No indicada"}`,
      "",
      "Mensaje:",
      data.message,
    ].join("\n"),
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
        <h2 style="margin:0 0 12px">Nuevo contacto — Mendifly</h2>
        <p><strong>Nombre:</strong> ${escapeHtml(data.name)}</p>
        <p><strong>Correo:</strong> ${escapeHtml(data.email)}</p>
        <p><strong>Teléfono:</strong> ${escapeHtml(data.phone || "No indicado")}</p>
        <p><strong>Servicio:</strong> ${escapeHtml(serviceLabel)}</p>
        <p><strong>Página:</strong> ${escapeHtml(data.sourcePage || "No indicada")}</p>
        <p><strong>Mensaje:</strong></p>
        <p style="white-space:pre-wrap">${escapeHtml(data.message)}</p>
      </div>
    `,
  });

  if (error) {
    console.error("[contact] Resend failed:", error.message);
    return false;
  }

  return true;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export async function processContactSubmission(
  data: ContactFormPayload,
): Promise<ContactSubmissionResult> {
  const [stored, emailSent] = await Promise.all([
    storeLead(data),
    sendLeadEmail(data),
  ]);

  return { stored, emailSent };
}

export function isContactConfigured(): boolean {
  const hasEmail =
    Boolean(process.env.RESEND_API_KEY) &&
    Boolean(process.env.CONTACT_TO_EMAIL);
  const hasDb =
    Boolean(process.env.SUPABASE_URL) &&
    Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);

  return hasEmail || hasDb;
}
