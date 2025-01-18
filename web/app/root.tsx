import { Outlet } from "react-router";

import { Config } from "constants/config";
import "./tailwind.css";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
        <head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>{Config.platform_name}</title>
        </head>
        <body>
            {children}
        </body>
    </html>
  );
}

export default function App() {
    return <Outlet />;
}
