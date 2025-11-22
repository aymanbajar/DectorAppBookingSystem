export default function Footer() {
  return (
    <footer className="bg-gray-100 font-serif text-black py-6 mt-10 ">
      <div className="container mx-auto px-4 text-center">
        <div className="flex  justify-center items-center gap-4 m-4">
          <a href="/" className="hover:text-blue-400">
            Ana Sayfa
          </a>
          <a href="/doctors" className="hover:text-blue-400">
            Tüm Doktorlar
          </a>
          <a href="/about" className="hover:text-blue-400">
            Hakkımızda
          </a>
          <a href="/contact" className="hover:text-blue-400">
            İletişim
          </a>
        </div>
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Tüm hakları saklıdır
        </p>
      </div>
    </footer>
  );
}
