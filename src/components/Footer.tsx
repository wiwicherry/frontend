const Footer = () => (
  <footer className="border-t bg-secondary py-8 mt-16">
    <div className="container mx-auto px-4 text-center">
      <p className="font-heading text-lg text-foreground">Wiwi & Cherry</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Handcrafted with love · &copy; {new Date().getFullYear()}
      </p>
    </div>
  </footer>
);

export default Footer;
