import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#1A1C1E] text-white">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-20 pb-12">
        {/* Logo & tagline */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-12 border-b border-white/10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 border-2 border-[#C4A265] rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-[#C4A265] rounded-full" />
              </div>
              <span className="font-heading text-xl font-semibold tracking-tight">
                Utah Process Servers
              </span>
            </div>
            <p className="text-white/45 max-w-md text-sm leading-relaxed">
              For over 15 years, we have served the Salt Lake Valley with
              professionalism and discretion. We deliver legal documents with
              precision, compliance, and unwavering reliability throughout Salt
              Lake County.
            </p>
          </div>
          <div className="flex gap-6 text-sm">
            <a
              href="https://le.utah.gov/xcode/Title78B/Chapter8/78B-8-S302.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-[#C4A265] transition-colors"
            >
              Utah Code §78B-8-302
            </a>
            <a
              href="https://www.utcourts.gov/rules/urcp.php"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-[#C4A265] transition-colors"
            >
              Utah Rules of Civil Procedure
            </a>
          </div>
        </div>

        {/* Services & counties */}
        <div className="grid md:grid-cols-3 gap-12 py-12 border-b border-white/10">
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-[#C4A265] font-semibold mb-6">
              Services
            </p>
            <ul className="space-y-3 text-sm text-white/50">
              {[
                "Standard Process Service",
                "Rush & Same-Day Service",
                "Substitute Service",
                "Corporate Service",
                "Eviction Notices",
                "Subpoena Service",
              ].map((s) => (
                <li key={s}>
                  <a href="#services" className="hover:text-white transition-colors">
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-[#C4A265] font-semibold mb-6">
              Quick Links
            </p>
            <ul className="space-y-3 text-sm text-white/50">
              {[
                { label: "About Us", href: "#services" },
                { label: "Our Process", href: "#process" },
                { label: "Benefits", href: "#benefits" },
                { label: "Coverage Area", href: "#coverage" },
                { label: "Request Service", href: "#contact" },
              ].map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="hover:text-white transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-[#C4A265] font-semibold mb-6">
              Contact
            </p>
            <ul className="space-y-3 text-sm text-white/50">
              <li>(801) 755-5445</li>
              <li>utahproservers@yahoo.com</li>
              <li>4448 Loren Von Dr., Millcreek, UT 84124</li>
              <li className="pt-2 text-white/35">Available 24 Hours a Day, 7 Days a Week</li>
              <li className="text-white/35">Including holidays & after-hours service</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} Utah Process Servers. All rights reserved.
            Serving the Salt Lake Valley for over 15 years.
          </p>
          <div className="flex gap-6 text-xs text-white/30">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}