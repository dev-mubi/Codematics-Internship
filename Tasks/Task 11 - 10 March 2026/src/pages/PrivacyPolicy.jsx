import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      id: "1",
      title: "Introduction",
      content: "Welcome to Cinevia. This Privacy Policy describes how Cinevia (\"we,\" \"us,\" or \"our\") collects, uses, stores, and protects information obtained from users (\"you\" or \"your\") who access or use the Cinevia web application (the \"Service\"), accessible at its designated URL.\n\nBy accessing or using the Service, you acknowledge that you have read, understood, and agree to be bound by the terms of this Privacy Policy. If you do not agree with any part of this policy, you must discontinue use of the Service immediately.\n\nCinevia is an independent, non-commercial web application developed as a personal software engineering project. It is not affiliated with, endorsed by, or connected to any commercial streaming platform, media company, or entertainment enterprise."
    },
    {
      id: "2",
      title: "Information We Collect",
      subsections: [
        {
          title: "Information You Provide Directly",
          content: "When you register for an account using email and password, we collect your email address, your chosen display name, and your encrypted password (managed and stored exclusively by Supabase Auth; we do not have access to plaintext passwords at any point)."
        },
        {
          title: "Information Collected via Third-Party Authentication",
          content: "When you choose to authenticate using Google Sign-In (OAuth 2.0), we receive from Google only your email address and your full name as registered with Google. We do not receive, request, or store your Google Account password or any other data beyond these identifiers."
        },
        {
          title: "Information Generated Through Your Use of the Service",
          content: "As you use Cinevia, we automatically generate and store your Watchlist (movie identifiers and titles sourced from TMDB) and your interface theme preferences (light or dark mode)."
        }
      ]
    },
    {
      id: "3",
      title: "How We Use Your Information",
      content: "We use the information we collect solely for account management, service functionality, essential communication, and security detection. We do not use your information for advertising, marketing, profiling, or any commercial purpose whatsoever."
    },
    {
      id: "4",
      title: "Third-Party Services",
      content: "Cinevia integrates with the following third-party services. Your use is subject to their practices:\n\n• Supabase: Data storage and authentication (supabase.com/privacy)\n• The Movie Database (TMDB): Movie metadata (themoviedb.org/privacy-policy)\n• Google OAuth: Authentication (policies.google.com/privacy)"
    },
    {
      id: "5",
      title: "Data Security",
      content: "We implement reasonable technical and organizational measures including Row-Level Security (RLS) policies at the database layer, JWT-based session management, and encrypted HTTPS/TLS connections for all data in transit."
    },
    {
      id: "6",
      title: "Contact",
      content: "If you have any questions, concerns, or requests regarding this Privacy Policy, you may contact us at:\n\nEmail: mobishahzaib@gmail.com\n\nWe will endeavor to respond within 14 business days."
    }
  ];

  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-40 pb-20 overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-accent/5 pointer-events-none" />
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="text-accent font-bold tracking-[0.4em] uppercase text-xs mb-4">Legal Framework</div>
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 tracking-tight">Privacy Policy</h1>
            <p className="text-xl text-muted font-light leading-relaxed">
              Transparent data practices for the Cinevia community.<br/> Last updated: March 12, 2025.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <main className="container mx-auto px-6 md:px-12 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Navigation - Sticky for desktop */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-32 space-y-4">
              <h4 className="text-xs uppercase tracking-[0.3em] font-bold text-primary/40 mb-6">Contents</h4>
              {sections.map(section => (
                <a 
                  key={section.id}
                  href={`#section-${section.id}`}
                  className="block text-sm text-muted hover:text-accent transition-colors font-medium border-l-2 border-transparent hover:border-accent pl-4 py-1"
                >
                  {section.title}
                </a>
              ))}
            </div>
          </aside>

          {/* Policy Text */}
          <div className="lg:col-span-8 lg:col-start-5 space-y-16">
            {sections.map(section => (
              <motion.section 
                id={`section-${section.id}`}
                key={section.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="scroll-mt-32"
              >
                <h2 className="text-2xl font-display font-bold mb-8 flex items-center gap-4">
                  <span className="text-accent/20 font-display text-4xl">0{section.id}</span>
                  {section.title}
                </h2>
                
                {section.content && (
                  <div className="text-muted leading-relaxed whitespace-pre-line text-lg font-light">
                    {section.content}
                  </div>
                )}

                {section.subsections && (
                  <div className="mt-8 space-y-8">
                    {section.subsections.map((sub, idx) => (
                      <div key={idx} className="bg-surface p-8 rounded-2xl border border-border/50">
                        <h3 className="text-lg font-bold mb-4 text-primary">{sub.title}</h3>
                        <p className="text-muted leading-relaxed font-light">{sub.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </motion.section>
            ))}

            <div className="pt-20 border-t border-border/50 italic text-sm text-muted text-center">
              Cinevia is an independent, non-commercial project and not a registered legal entity.
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
