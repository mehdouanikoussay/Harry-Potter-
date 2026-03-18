import { useState, useEffect } from 'react';
import { Volume2, VolumeX, Menu, X } from 'lucide-react';

interface NavigationProps {
  isMuted: boolean;
  toggleMute: () => void;
}

const navLinks = [
  { label: 'Map', href: '#map' },
  { label: 'Quiz', href: '#quiz' },
  { label: 'Creator', href: '#creator' },
  { label: 'Shop', href: '#shop' },
  { label: 'Library', href: '#library' },
  { label: 'Game', href: '#game' }
];

export const Navigation = ({ isMuted, toggleMute }: NavigationProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled
            ? 'bg-[#0B0D10]/90 backdrop-blur-md py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="w-full px-6 lg:px-12 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="font-heading text-xl lg:text-2xl font-bold text-[#F3F1EA] hover:text-[#C8A14E] transition-colors"
          >
            Wizarding World Hub
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className="font-ui text-xs uppercase tracking-wider text-[#A9B1BD] hover:text-[#C8A14E] transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleMute}
              className="p-2 rounded-full hover:bg-[#C8A14E]/10 transition-colors"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 text-[#A9B1BD]" />
              ) : (
                <Volume2 className="w-5 h-5 text-[#C8A14E]" />
              )}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-full hover:bg-[#C8A14E]/10 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-[#F3F1EA]" />
              ) : (
                <Menu className="w-5 h-5 text-[#F3F1EA]" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-30 bg-[#0B0D10]/98 backdrop-blur-lg transition-all duration-300 lg:hidden ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollToSection(link.href)}
              className="font-heading text-2xl text-[#F3F1EA] hover:text-[#C8A14E] transition-colors"
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};
