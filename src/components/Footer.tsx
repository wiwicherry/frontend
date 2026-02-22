import { Link } from "react-router-dom";
const Footer = () => (
  <footer className="border-t bg-secondary py-5 mt-16">
    <div className="container mx-auto px-4 text-center flex justify-between items-center">
      <p className="font-heading text-lg text-foreground">Wiwi & Cherry</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Handcrafted with love · &copy; {new Date().getFullYear()}
      </p>
      <Link to="/privacy" className="hover:text-[#E5989B] transition-colors mt-2 inline-block">
    Privacy Policy
  </Link>
    </div>
  </footer>
);

export default Footer;
