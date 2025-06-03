

const Footer = () => {
  return (
    <footer className="bg-[var(--c6)]  text-white text-center py-4  z-10">
      <div className="container mx-auto">
        <p className="text-sm">&copy; {new Date().getFullYear()}  Created by Kamil Tatrocki and Łukasz Trzak</p>
    
      </div>
    </footer>
  );
};

export default Footer;