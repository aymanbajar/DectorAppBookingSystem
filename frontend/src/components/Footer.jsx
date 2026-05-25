import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white">
      <div className="page-shell flex flex-col gap-6 py-8 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
        <div>
          <p className="text-lg font-bold text-slate-950">Dector</p>
          <p className="mt-1 text-sm text-slate-500">
            &copy; {new Date().getFullYear()} Tüm hakları saklıdır.
          </p>
        </div>
        <nav className="flex flex-wrap justify-center gap-4 text-sm font-semibold text-slate-600">
          <Link to="/" className="hover:text-cyan-700">Ana Sayfa</Link>
          <Link to="/doctors" className="hover:text-cyan-700">Doktorlar</Link>
          <Link to="/about" className="hover:text-cyan-700">Hakkımızda</Link>
          <Link to="/contact" className="hover:text-cyan-700">İletişim</Link>
        </nav>
      </div>
    </footer>
  );
}
