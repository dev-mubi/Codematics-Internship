import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-surface border-t border-border mt-20 pt-16 pb-12 px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="mb-8 md:mb-0">
          <span className="text-2xl font-display font-bold text-accent tracking-tighter">CINEVIA</span>
          <p className="mt-4 text-muted text-sm max-w-xs">
            Experience cinema like never before. Discovery, personalization, and pure editorial precision.
          </p>
        </div>

        <div className="flex space-x-12">
          <div>
            <h4 className="text-primary font-bold mb-4 text-xs uppercase tracking-widest">Platform</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li><Link to="/" className="hover:text-accent transition-colors">Browse</Link></li>
              <li><Link to="/catalog" className="hover:text-accent transition-colors">Catalog</Link></li>
              <li><Link to="/watchlist" className="hover:text-accent transition-colors">Watchlist</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-primary font-bold mb-4 text-xs uppercase tracking-widest">Legal</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li><Link to="/privacy" className="hover:text-accent transition-colors">Privacy</Link></li>
              <li><Link to="/terms" className="hover:text-accent transition-colors">Terms</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-border/30 flex justify-between items-center text-[10px] text-muted uppercase tracking-[0.2em]">
        <span>&copy; 2026 Cinevia Project</span>
        <span>Powered by TMDB & Supabase</span>
      </div>
    </footer>
  );
};

export default Footer;
