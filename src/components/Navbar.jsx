import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "Services", href: "#services" },
    { label: "Benefits", href: "#benefits" },
    { label: "Process", href: "#process" },
    { label: "Coverage", href: "#coverage" },
    { label: "Contact", href: "#contact" },
    { label: "Get Started", href: "/pricing", isPage: true },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-8 h-8 border-2 border-primary rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-primary rounded-full" />
              </div>
              <div>
                <span className="font-heading text-lg font-semibold tracking-tight text-foreground">
                  Utah Process Servers
                </span>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-10">
              {navLinks.map((link) =>
                link.isPage ? (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="text-sm font-medium text-primary hover:text-primary/80 transition-colors tracking-wide uppercase flex items-center gap-1.5"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors tracking-wide uppercase"
                  >
                    {link.label}
                  </a>
                )
              )}
            </div>

            <div className="hidden lg:flex items-center gap-4">
<a href="#contact">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium tracking-wide text-sm px-6">
                  Request Service
                </Button>
              </a>
            </div>

            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden text-foreground"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-background"
          >
            <div className="flex items-center justify-between p-6">
              <span className="font-heading text-lg font-semibold">
                Utah Process Servers
              </span>
              <button onClick={() => setMobileOpen(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex flex-col items-start gap-8 px-6 pt-12">
              {navLinks.map((link) =>
                link.isPage ? (
                  <Link
                    key={link.label}
                    to={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="font-heading text-3xl font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-3"
                  >
                    <Lock className="w-6 h-6" />
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="font-heading text-3xl font-medium text-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                )
              )}
              <a href="#contact" onClick={() => setMobileOpen(false)} className="w-full mt-4">
                <Button className="w-full bg-primary text-primary-foreground text-lg py-6">
                  Request Service
                </Button>
              </a>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}