import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const TermsOfService = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      id: "1",
      title: "Acceptance of Terms",
      content: "By accessing or using the Cinevia web application (the \"Service\"), you (\"User,\" \"you,\" or \"your\") agree to be legally bound by these Terms of Service (\"Terms\"). These Terms constitute a binding agreement between you and the individual developer operating Cinevia (\"we,\" \"us,\" or \"our\").\n\nIf you do not agree to these Terms in their entirety, you are not authorized to access or use the Service and must cease all use immediately."
    },
    {
      id: "2",
      title: "Description of Service",
      content: "Cinevia is a non-commercial, independently developed web application that enables registered users to discover, browse, and organize movies using publicly available data provided by The Movie Database (TMDB) API.\n\nCinevia does not host, stream, distribute, sell, or provide access to any film, video, or media content. All movie metadata displayed within the Service is sourced from the TMDB API and remains the property of its respective rights holders. Trailers are embedded via YouTube and are subject to YouTube's terms and conditions."
    },
    {
      id: "3",
      title: "Acceptable Use",
      content: "You agree to use the Service only for lawful purposes. You expressly agree that you will not:\n\n• Violate any applicable local, national, or international law.\n• Attempt to gain unauthorized access to any portion of the Service.\n• Use automated scripts, bots, or scrapers to interact with the Service.\n• Reverse engineer or attempt to derive the source code.\n• Transmit viruses, malware, or harmful code."
    },
    {
      id: "4",
      title: "Disclaimer of Warranties",
      content: "THE SERVICE IS PROVIDED ON AN \"AS IS\" AND \"AS AVAILABLE\" BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. We do not warrant that the Service will be uninterrupted, error-free, or free of viruses."
    },
    {
      id: "5",
      title: "Limitation of Liability",
      content: "IN NO EVENT SHALL THE DEVELOPER OF CINEVIA BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES ARISING OUT OF YOUR USE OF THE SERVICE. Given the non-commercial nature of the Service, our total liability shall in all cases be zero (PKR 0)."
    },
    {
      id: "6",
      title: "Governing Law",
      content: "These Terms shall be governed by and construed in accordance with the laws of the Islamic Republic of Pakistan, without regard to its conflict of law provisions."
    }
  ];

  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-40 pb-20 overflow-hidden border-b border-border/50 text-primary">
        <div className="absolute inset-0 bg-accent/5 pointer-events-none" />
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="text-accent font-bold tracking-[0.4em] uppercase text-xs mb-4">Agreement</div>
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 tracking-tight">Terms of Service</h1>
            <p className="text-xl text-muted font-light leading-relaxed">
              Rules and guidelines for interacting with the Cinevia platform.<br/> Last updated: March 12, 2026.
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

          {/* Terms Text */}
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
                
                <div className="text-muted leading-relaxed whitespace-pre-line text-lg font-light">
                  {section.content}
                </div>
              </motion.section>
            ))}

            <div className="pt-20 border-t border-border/50 italic text-sm text-muted text-center">
              By using Cinevia, you agree to abide by these terms. This is a non-commercial software project.
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsOfService;
