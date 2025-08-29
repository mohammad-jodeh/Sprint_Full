/**
 * BackgroundDecorations Component - Renders the decorative background elements
 */
const BackgroundDecorations = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary opacity-10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-600 opacity-10 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-custom-600 opacity-10 rounded-full blur-3xl"></div>
      <div className="hidden md:block absolute top-1/4 right-1/3 w-32 h-32 bg-teal-400 opacity-10 rounded-full blur-2xl"></div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
    </div>
  );
};

export default BackgroundDecorations;
