export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <head>
        {/* Fonte Inter */}
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
        {/* Bootstrap CSS */}
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" />
        {/* Bootstrap Icons */}
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
        <style>{`body { font-family: 'Inter', sans-serif; transition: background-color 0.3s, color 0.3s; }`}</style>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}