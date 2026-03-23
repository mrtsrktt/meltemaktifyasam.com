import { NextRequest, NextResponse } from "next/server";

function buildResultPage(status: string) {
  const isSuccess = status === "success";
  const message = isSuccess
    ? "Ödeme başarılı, yönlendiriliyorsunuz..."
    : "Ödeme başarısız oldu.";

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
    .msg {
      text-align: center;
      padding: 2rem;
    }
  </style>
</head>
<body>
  <div class="msg">
    <p>${message}</p>
  </div>
  <script>
    if (window.parent !== window) {
      window.parent.postMessage(
        { type: 'PAYTR_RESULT', status: '${status}' },
        '*'
      );
    }
  </script>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

// PayTR may redirect via GET or POST
export async function GET(request: NextRequest) {
  const status = new URL(request.url).searchParams.get("status") || "fail";
  return buildResultPage(status);
}

export async function POST(request: NextRequest) {
  const status = new URL(request.url).searchParams.get("status") || "fail";
  return buildResultPage(status);
}
