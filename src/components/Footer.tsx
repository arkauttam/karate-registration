import { Award, Mail, Phone, MapPin, Heart } from "lucide-react";
import Logo from "./Logo";

export const Footer = () => {
  return (
    <footer className="mt-20 bg-gray-200 border-slate-300 border-t">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Main grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 sm:gap-12 ">
          {/* Brand Section */}
          <div className="space-y-4 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
              <Logo />
              <div>
                <h3 className="text-xl font-bold text-foreground text-gray-700">
                  Azad Hind Karate Foundation
                </h3>
                <a
                  href="https://www.ashiharakarate.org/profiles/hoosain-narker/"
                  className="social-link gradient-ai-text pl-1 sm:pl-2 text-primary font-medium animate-pulse"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Kaicho Hoosain Narker"
                >
                  Kaicho Hoosain Narker
                </a>
              </div>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-md mx-auto sm:mx-0">
              "Azad Hind International Karate Foundation, now part of Ashihara Karate International with Kaicho Hoosain Narker as Chief Technical Advisor, focuses on Sabaki principles and target-based striking."
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 text-center sm:text-left">
            <h4 className="font-semibold text-foreground text-gray-700">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: "Student Registration", href: "#register" },
                { label: "Belt Requirements", href: "#belts" },
                { label: "Fee Structure", href: "#fees" },
                { label: "Training Schedule", href: "#schedule" },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4 text-center sm:text-left">
            <h4 className="font-semibold text-foreground text-gray-700">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-center sm:justify-start gap-3 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                <span>633W+P5V, Jordiha, Satpukharia, West Bengal 721170</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-3 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <span>+91 8637827773</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-3 text-sm text-muted-foreground">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <span>info@karateacademy.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-10 pt-8 border-t border-gray-300 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Azad Hind Karate Foundation. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground">
            <span>Made by</span>
            <a
              href="https://www.linkedin.com/in/uttam-ghosh-7187a2258/"
              className="social-link gradient-ai-text pl-1 sm:pl-2 text-primary font-medium"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile of Uttam Ghosh"
            >
              Uttam Ghosh
            </a>
            <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 animate-pulse" />
            <span>for martial arts excellence</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
