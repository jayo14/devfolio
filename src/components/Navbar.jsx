const links = [
  { label: "Home", href: "#home" },
  { label: "About Us", href: "#about" },
  { label: "Our Work", href: "#work" },
  { label: "Blog", href: "#blog" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  return (
    <header className="fixed inset-x-0 top-0 z-50 h-[60px] bg-black">
      <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-6 lg:px-20">
        <a
          href="#home"
          className="text-[15px] font-semibold uppercase tracking-[0.08em] text-white"
        >
          DevMastery
        </a>

        <nav aria-label="Primary">
          <ul className="flex items-center gap-6">
            {links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-[13px] font-medium uppercase tracking-[0.08em] text-white"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
