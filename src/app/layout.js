import './globals.css'

export const metadata = {
  title: 'Mi Tienda Online',
  description: 'Catálogo de productos',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-gray-50">
        {children}
      </body>
    </html>
  );
}