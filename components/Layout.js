import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Layout({ children }) {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>TaskBoards</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="app">
        <header className="topbar">
          <div className="container">
            <h1 className="logo">
              <Link href="/" legacyBehavior>
                <a className="logo-link">TaskBoards</a>
              </Link>
            </h1>
            <nav>
              <Link href="/dashboard" legacyBehavior>
                <a className="nav-link">Dashboard</a>
              </Link>
              <a
                href="#"
                onClick={async (e) => {
                  e.preventDefault();
                  await fetch("/api/auth/logout", { method: "POST" });
                  router.push("/");
                }}
              >
                Logout
              </a>
            </nav>
          </div>
        </header>

        <main className="container">{children}</main>

        <footer className="footer"></footer>
      </div>

      <style jsx>{`
        .topbar {
          background: #0f172a;
          color: #fff;
          padding: 14px 0;
        }
        .container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 0 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .logo-link {
          color: #fff;
          text-decoration: none;
          font-weight: 700;
        }
        nav :global(a),
        nav :global(.nav-link) {
          color: #cbd5e1;
          margin-left: 16px;
          text-decoration: none;
        }
        .footer {
          text-align: center;
          padding: 20px 0;
          color: #64748b;
          margin-top: 40px;
        }
      `}</style>
    </>
  );
}
