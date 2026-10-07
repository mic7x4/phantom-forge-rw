import { createFileRoute } from "@tanstack/react-router";
import { handleIremboPayWebhook } from "@/server/irembopay";

export const Route = createFileRoute("/api/irembopay/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const rawBody = await request.text();
        const signature = request.headers.get("irembopay-signature") ?? "";

        try {
          await handleIremboPayWebhook(rawBody, signature);
          return Response.json({ success: true });
        } catch (error) {
          console.error("IremboPay webhook error", error);
          return Response.json(
            { success: false, message: error instanceof Error ? error.message : "Webhook processing failed." },
            { status: 400 },
          );
        }
      },
    },
  },
});
