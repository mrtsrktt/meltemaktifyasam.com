"use client";

import { motion } from "framer-motion";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "905412523421";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.132 6.744 3.052 9.38L1.056 31.2l6.064-1.952A15.9 15.9 0 0 0 16.004 32C24.824 32 32 24.824 32 16S24.824 0 16.004 0Zm9.32 22.608c-.392 1.104-1.94 2.02-3.192 2.288-.856.18-1.972.324-5.732-1.232-4.812-1.992-7.912-6.876-8.152-7.196-.232-.32-1.94-2.584-1.94-4.928s1.228-3.496 1.664-3.976c.436-.48.952-.6 1.268-.6.316 0 .628.004.904.016.288.012.676-.112 1.06.808.392.94 1.332 3.244 1.448 3.48.116.236.192.512.036.832-.152.32-.232.52-.464.8-.232.284-.488.632-.696.848-.232.24-.472.496-.204.972.268.476 1.196 1.972 2.568 3.196 1.764 1.572 3.252 2.06 3.716 2.288.464.232.736.196 1.008-.116.268-.316 1.16-1.348 1.468-1.812.308-.464.616-.384 1.04-.232.424.156 2.704 1.276 3.168 1.508.464.232.772.348.888.54.116.192.116 1.104-.276 2.208Z" />
    </svg>
  );
}

export default function WhatsAppButton() {
  return (
    <motion.a
      href={`https://wa.me/${WHATSAPP_NUMBER}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_4px_12px_rgba(37,211,102,0.4)] hover:shadow-[0_6px_20px_rgba(37,211,102,0.6)]"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label="WhatsApp ile iletişime geç"
    >
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-20" />
      <WhatsAppIcon className="relative h-8 w-8" />
    </motion.a>
  );
}
