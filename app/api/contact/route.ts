import { NextResponse } from "next/server";

import {
  isContactConfigured,
  processContactSubmission,
  validateContactPayload,
} from "@/lib/contact-server";

export async function POST(request: Request) {
  try {
    if (!isContactConfigured()) {
      return NextResponse.json(
        {
          error:
            "El formulario aún no está configurado en el servidor. Revisa las variables de entorno.",
        },
        { status: 503 },
      );
    }

    const body: unknown = await request.json();
    const parsed = validateContactPayload(body);

    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const result = await processContactSubmission(parsed.data);

    if (!result.emailSent && !result.stored) {
      return NextResponse.json(
        {
          error:
            "No pudimos registrar tu mensaje. Intenta de nuevo en unos minutos.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json({
      ok: true,
      emailSent: result.emailSent,
      stored: result.stored,
    });
  } catch (error) {
    console.error("[contact] Unexpected error:", error);
    return NextResponse.json(
      { error: "Ocurrió un error inesperado. Intenta de nuevo." },
      { status: 500 },
    );
  }
}
