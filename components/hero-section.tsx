export function HeroSection() {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center px-6 overflow-hidden">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <div className="mb-8">
          <span className="inline-block w-24 h-px bg-muted-foreground/50" />
        </div>

        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground text-balance">
          HMD (Holocaust Memorial Day)
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
          Honoring the memory of six million Jewish men, women, and children
          who perished during the Holocaust, and millions of others who
          suffered under Nazi persecution.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <div className="text-sm text-muted-foreground tracking-widest uppercase">
            Remember
          </div>
          <span className="hidden sm:inline text-muted-foreground/50">|</span>
          <div className="text-sm text-muted-foreground tracking-widest uppercase">
            Learn
          </div>
          <span className="hidden sm:inline text-muted-foreground/50">|</span>
          <div className="text-sm text-muted-foreground tracking-widest uppercase">
            Never Forget
          </div>
          <span className="hidden sm:inline text-muted-foreground/50">|</span>
          <div className="text-sm text-muted-foreground tracking-widest uppercase">
               <a
          href="https://padlet.com/emanuelenava1/hmd-wall-yyydz6tfkf580aap/wish/3774916403"
          className="text-sm text-muted-foreground tracking-widest uppercase"
        >
         Our Wall
        </a>
          </div>
        </div>


        <div className="mt-12">
          <span className="inline-block w-24 h-px bg-muted-foreground/50" />
        </div>
      </div>

      {/* Subtle candle flames */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-16 pb-8 opacity-30">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="w-1 h-8 rounded-full animate-pulse"
            style={{
              background: "linear-gradient(to top, #8B4513, #FFA500, #FFD700)",
              animationDelay: `${i * 0.3}s`,
              animationDuration: "2s",
            }}
          />
        ))}
      </div>
    </section>
  );
}
