import { ClarityScript } from "@/components/clarity";

export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://www.clarity.ms" />
        <link rel="stylesheet" href="/assets/preview.v2.css" />
      </head>
      <body>
        {children}
        <ClarityScript />
      </body>
    </html>
  );
}