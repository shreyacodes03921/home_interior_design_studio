import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { Button } from '../components/ui/Button';
import { Award, Feather, ShieldCheck, Compass, Sparkles, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { openBookingModal } = useAppStore();

  const team = [
    {
      name: 'Eleanor Vance',
      role: 'Founding Principal & Creative Director',
      bio: 'Trained at the Architectural Association in London and the École des Beaux-Arts, Eleanor advocates for sensory minimalism and the profound dialogue between natural stone, light, and silence.',
      specialty: 'Spatial Architecture & Quiet Luxury',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Marcus Lindqvist',
      role: 'Lead Architect & Technical Director',
      bio: 'With 16 years leading residential commissions across Stockholm and Zurich, Marcus bridges rigorous structural engineering with bespoke joinery and low-carbon materials.',
      specialty: 'Nordic Joinery & Structural Restraint',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Sophia Laurent',
      role: 'Head of Materiality & Textile Curation',
      bio: 'Formerly of Studio Liaigre Paris, Sophia travels globally to curate heritage Belgian linens, vegetable-tanned leathers, and custom ceramic glaze palettes.',
      specialty: 'Tactile Finishes & Custom Millwork',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Kenji Takahashi',
      role: 'Principal Lighting & Spatial Choreographer',
      bio: 'Kenji specializes in circadian shadow play and the Japanese philosophy of Ma (negative space), sculpting emotional atmosphere through concealed cove lighting.',
      specialty: 'Japandi Spatial Flow & Shadow Play',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const awards = [
    { year: '2025', title: 'AD100 Honoree', org: 'Architectural Digest International' },
    { year: '2024', title: 'Residential Space of the Year', org: 'Wallpaper* Design Awards' },
    { year: '2023', title: 'Best Sustainable Luxury Studio', org: 'Elle Decor International' },
    { year: '2022', title: 'Gold Medal in Bespoke Millwork', org: 'European Interior Architecture Guild' },
  ];

  const press = [
    'Architectural Digest',
    'Elle Decor',
    'Wallpaper*',
    'Vogue Living',
    'Monocle',
    'The Financial Times',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-24">
      {/* Editorial Studio Intro */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="text-xs uppercase tracking-[0.25em] text-stone-500 font-semibold">
            Studio Heritage
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-stone-900 font-light tracking-tight leading-[1.1]">
            Architecture Born of <span className="italic">Silence</span> and Substance.
          </h1>
          <p className="text-base text-stone-600 font-light leading-relaxed">
            Founded in 2018 in Soho, New York, Atelier Luxe was created as an antidote to disposable interior trends. We believe that true luxury does not shout; it resonates through the subtle grain of quarter-sawn oak, the cool touch of honed limestone, and the deliberate choreography of daylight across empty surfaces.
          </p>
          <p className="text-base text-stone-600 font-light leading-relaxed">
            Every project begins with listening—to the architectural lineage of the building, the circadian rhythms of the occupants, and the sensory textures that provide grounding calm.
          </p>
          <div className="pt-2">
            <Button variant="luxury" onClick={() => openBookingModal()} className="uppercase text-xs tracking-wider">
              Reserve Studio Consultation
            </Button>
          </div>
        </div>

        <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border border-stone-200">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
            alt="Atelier Luxe Soho Studio workshop"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-stone-950/20" />
          <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-stone-950/80 backdrop-blur-md text-stone-200 text-xs flex items-center justify-between">
            <span>74 Mercer Street Showroom • New York</span>
            <span className="text-amber-300 font-mono">EST. 2018</span>
          </div>
        </div>
      </div>

      {/* Principal Designers Section */}
      <div className="space-y-12">
        <div className="max-w-2xl space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-stone-500 font-semibold">
            Leadership
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 font-light">
            Principal Architects & Material Curators
          </h2>
          <p className="text-sm text-stone-600 font-light leading-relaxed">
            Our multi-disciplinary team unites structural architects, master millwork designers, and textile historians.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, i) => (
            <div key={i} className="group bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs space-y-4 flex flex-col">
              <div className="aspect-[3/4] overflow-hidden bg-stone-100 relative">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <h3 className="font-serif text-xl font-medium text-stone-900">{member.name}</h3>
                  <p className="text-xs font-mono text-amber-900 font-medium">{member.role}</p>
                </div>

                <p className="text-xs text-stone-600 font-light leading-relaxed">
                  {member.bio}
                </p>

                <div className="pt-2 border-t border-stone-100">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-500">
                    Focus:
                  </span>
                  <p className="text-xs font-mono text-stone-800 font-medium mt-0.5">
                    {member.specialty}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Awards & Distinctions */}
      <div className="bg-stone-900 text-stone-100 rounded-3xl p-10 sm:p-16 space-y-12">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs uppercase tracking-[0.25em] text-amber-300 font-semibold">
            Recognition
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-white font-light">
            Studio Awards & Guild Distinctions
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {awards.map((award, i) => (
            <div key={i} className="p-6 rounded-xl bg-stone-800/70 border border-stone-700/80 space-y-3">
              <Award className="w-6 h-6 text-amber-300" />
              <p className="font-mono text-xs text-amber-200/80">{award.year}</p>
              <h4 className="font-serif text-lg text-white font-normal">{award.title}</h4>
              <p className="text-xs text-stone-400 font-light">{award.org}</p>
            </div>
          ))}
        </div>

        {/* Press Bar */}
        <div className="pt-8 border-t border-stone-800 space-y-4">
          <p className="text-xs uppercase tracking-widest text-stone-400 font-semibold text-center">
            As Featured In
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 text-stone-400 font-serif text-lg tracking-wider">
            {press.map((p, i) => (
              <span key={i} className="hover:text-amber-200 transition-colors">
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Sustainable Craft Charter */}
      <div className="border border-stone-200 rounded-2xl p-8 sm:p-12 space-y-6 bg-stone-50/60">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-emerald-700" />
          <h3 className="font-serif text-2xl text-stone-900 font-light">
            Our Sustainable Sourcing Charter
          </h3>
        </div>
        <p className="text-sm text-stone-600 font-light leading-relaxed max-w-3xl">
          We reject petroleum-based foams and synthetic laminates. 100% of our architectural timber is FSC-certified European or American hardwood, our paints are solvent-free mineral limewashes, and our stone offcuts are cataloged and repurposed into custom accent plinths and vanity details.
        </p>
      </div>
    </div>
  );
};
