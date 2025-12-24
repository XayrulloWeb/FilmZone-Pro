const PageHeader = ({ title, children }) => {
  return (
    <div className="relative pt-32 pb-10 px-4 md:px-10 border-b border-white/5 bg-gradient-to-b from-surface/50 to-background">
      {/* Декоративное пятно на фоне */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-[1600px] mx-auto relative z-10 text-center">
        <h1 className="text-3xl md:text-5xl font-black text-white mb-6 drop-shadow-lg tracking-tight">
          {title}
        </h1>
        {children}
      </div>
    </div>
  );
};

export default PageHeader;