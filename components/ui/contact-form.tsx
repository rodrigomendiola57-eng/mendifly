"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  contactServiceOptions,
  isValidContactService,
  type ContactServiceId,
} from "@/lib/contact-data";
import { cn } from "@/lib/utils";

type FormStatus = "idle" | "submitting" | "success" | "error";

interface ContactFormProps {
  className?: string;
}

const defaultService: ContactServiceId = "general";

export function ContactForm({ className }: ContactFormProps) {
  const searchParams = useSearchParams();
  const serviceFromUrl = searchParams.get("servicio");

  const urlService: ContactServiceId | null =
    serviceFromUrl && isValidContactService(serviceFromUrl)
      ? serviceFromUrl
      : null;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [serviceOverride, setServiceOverride] =
    useState<ContactServiceId | null>(null);
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const service = serviceOverride ?? urlService ?? defaultService;

  useEffect(() => {
    if (!serviceFromUrl || !isValidContactService(serviceFromUrl)) return;

    const timer = window.setTimeout(() => {
      document.getElementById("formulario")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 120);

    return () => window.clearTimeout(timer);
  }, [serviceFromUrl]);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setStatus("submitting");
      setErrorMessage("");

      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            phone,
            service,
            message,
            website,
            sourcePage:
              typeof window !== "undefined"
                ? `${window.location.pathname}${window.location.search}`
                : undefined,
          }),
        });

        const data = (await response.json()) as { error?: string };

        if (!response.ok) {
          throw new Error(data.error ?? "No pudimos enviar tu mensaje.");
        }

        setStatus("success");
        setName("");
        setEmail("");
        setPhone("");
        setMessage("");
        setWebsite("");
      } catch (error) {
        setStatus("error");
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "No pudimos enviar tu mensaje. Intenta de nuevo.",
        );
      }
    },
    [name, email, phone, service, message, website],
  );

  if (status === "success") {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06] px-6 py-12 text-center",
          className,
        )}
      >
        <CheckCircle2 className="mb-4 h-12 w-12 text-emerald-400" strokeWidth={1.5} />
        <h3 className="font-display text-xl font-semibold text-white">
          Mensaje enviado
        </h3>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-zinc-400">
          Gracias por contactarnos. Revisaremos tu solicitud y te responderemos
          muy pronto.
        </p>
        <Button
          type="button"
          variant="secondary"
          className="mt-6"
          onClick={() => setStatus("idle")}
        >
          Enviar otro mensaje
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("space-y-5", className)}
      noValidate
    >
      {/* Honeypot — oculto para bots */}
      <div className="sr-only" aria-hidden>
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact-name">Nombre</Label>
          <Input
            id="contact-name"
            name="name"
            placeholder="Tu nombre"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={status === "submitting"}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-email">Correo</Label>
          <Input
            id="contact-email"
            name="email"
            type="email"
            placeholder="tu@empresa.com"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "submitting"}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact-phone">WhatsApp / Teléfono</Label>
          <Input
            id="contact-phone"
            name="phone"
            type="tel"
            placeholder="+52 55 0000 0000"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={status === "submitting"}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-service">Servicio de interés</Label>
          <select
            id="contact-service"
            name="service"
            required
            value={service}
            onChange={(e) =>
              setServiceOverride(e.target.value as ContactServiceId)
            }
            disabled={status === "submitting"}
            className={cn(
              "flex h-11 w-full appearance-none rounded-xl border border-zinc-800/80 bg-zinc-950/60 px-4 text-sm text-white",
              "transition-colors duration-200",
              "focus-visible:border-cyan-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/20",
              "disabled:cursor-not-allowed disabled:opacity-50",
            )}
          >
            <optgroup label="Planes">
              {contactServiceOptions
                .filter((option) => option.group === "pricing")
                .map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
            </optgroup>
            <optgroup label="Servicios">
              {contactServiceOptions
                .filter((option) => option.group === "services")
                .map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
            </optgroup>
            <optgroup label="General">
              {contactServiceOptions
                .filter((option) => option.group === "general")
                .map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
            </optgroup>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-message">Mensaje</Label>
        <Textarea
          id="contact-message"
          name="message"
          placeholder="Cuéntanos sobre tu proyecto, objetivos y plazos..."
          required
          minLength={10}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={status === "submitting"}
        />
      </div>

      {status === "error" && errorMessage && (
        <p
          role="alert"
          className="rounded-xl border border-red-500/20 bg-red-500/[0.08] px-4 py-3 text-sm text-red-300"
        >
          {errorMessage}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        className="h-12 w-full sm:w-auto"
        disabled={status === "submitting"}
      >
        {status === "submitting" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Enviando...
          </>
        ) : (
          <>
            Enviar solicitud
            <Send className="h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  );
}
