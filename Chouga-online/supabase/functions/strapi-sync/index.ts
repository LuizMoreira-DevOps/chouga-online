const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-strapi-webhook-secret",
};

type StrapiWebhookPayload = {
  event?: string;
  model?: string;
  createdAt?: string;
  entry?: {
    id?: number | string;
    documentId?: string;
    publishedAt?: string | null;
    [key: string]: unknown;
  };
};

function jsonResponse(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response("ok", {
        headers: corsHeaders,
      });
    }

    if (request.method !== "POST") {
      return jsonResponse(
        {
          success: false,
          error: "Método não permitido.",
        },
        405,
      );
    }

    try {
      const webhookSecret = request.headers.get("x-strapi-webhook-secret");

      const expectedSecret = Deno.env.get("STRAPI_WEBHOOK_SECRET");

      if (!expectedSecret) {
        throw new Error("STRAPI_WEBHOOK_SECRET não está configurado.");
      }

      if (webhookSecret !== expectedSecret) {
        return jsonResponse(
          {
            success: false,
            error: "Webhook não autorizado.",
          },
          401,
        );
      }

      const payload = (await request.json()) as StrapiWebhookPayload;

      console.log(
        "Payload completo do Strapi:",
        JSON.stringify(payload, null, 2),
      );

      console.log("Webhook recebido:", {
        event: payload.event,
        model: payload.model,
        entryId: payload.entry?.id,
        documentId: payload.entry?.documentId,
        publishedAt: payload.entry?.publishedAt,
      });

      return jsonResponse({
        success: true,
        message: "Webhook recebido com sucesso.",
        payload,
      });
    } catch (error) {
      console.error("Erro no webhook:", error);

      return jsonResponse(
        {
          success: false,
          error: error instanceof Error ? error.message : "Erro desconhecido.",
        },
        500,
      );
    }
  },
};
