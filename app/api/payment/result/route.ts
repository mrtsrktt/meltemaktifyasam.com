import { NextRequest, NextResponse } from "next/server";

function buildResultPage(status: string, loc: string) {
  const isSuccess = status === "success";
  const message = isSuccess
    ? "Ödeme başarılı, yönlendiriliyorsunuz..."
    : "Ödeme başarısız, yönlendiriliyorsunuz...";

  // Ödeme sayfası yolu locale'e göre değişir (TR: /odeme, EN: /checkout)
  const checkoutPath = loc === "en" ? "/en/checkout" : "/tr/odeme";
  const redirectUrl = `${checkoutPath}?payment=${status}`;

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Ödeme Sonucu</title>
  <style>
    body {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #fafafa;
      color: #333;
    }
    .msg { text-align: center; padding: 2rem; }
  </style>
</head>
<body>
  <div class="msg"><p>${message}</p></div>
  <script>
    // Try postMessage for iframe, then redirect top window
    if (window.parent !== window) {
      window.parent.postMessage({ type: 'PAYTR_RESULT', status: '${status}' }, '*');
    }
    window.top.location.href = '${redirectUrl}';
  </script>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

function parseParams(request: NextRequest) {
  const sp = new URL(request.url).searchParams;
  const status = sp.get("status") || "fail";
  const loc = sp.get("loc") === "en" ? "en" : "tr";
  return { status, loc };
}

export async function GET(request: NextRequest) {
  const { status, loc } = parseParams(request);
  return buildResultPage(status, loc);
}

export async function POST(request: NextRequest) {
  const { status, loc } = parseParams(request);
  return buildResultPage(status, loc);
}
