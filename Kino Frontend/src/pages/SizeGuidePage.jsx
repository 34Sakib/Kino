import React from 'react';
import { Ruler, DoorClosed, HelpCircle } from 'lucide-react';

const SIZE_GUIDES = [
  {
    category: 'Travertine Sculpture Accent Objects',
    specs: [
      { name: 'Small Vessel', height: '6" (15cm)', diameter: '4" (10cm)', weight: '2.5 lbs (1.1kg)' },
      { name: 'Medium Vessel', height: '9" (23cm)', diameter: '6" (15cm)', weight: '4.2 lbs (1.9kg)' },
      { name: 'Grande Vessel', height: '12" (30cm)', diameter: '8" (20cm)', weight: '8.8 lbs (4.0kg)' }
    ]
  },
  {
    category: 'Ceramic Fluted Light Drops',
    specs: [
      { name: '10" Pendant Lamp', height: '8" (20cm)', diameter: '10" (25cm)', weight: '3.1 lbs (1.4kg)' },
      { name: '14" Pendant Lamp', height: '11" (28cm)', diameter: '14" (35cm)', weight: '5.5 lbs (2.5kg)' }
    ]
  },
  {
    category: 'Solid Oak Workshop Furniture',
    specs: [
      { name: 'Oak Lounge Chair', height: '29.5" (75cm)', diameter: '28" W x 30" D', weight: '22 lbs (10kg)' },
      { name: 'Writing Desk (120cm)', height: '29.5" (75cm)', diameter: '48" W x 24" D', weight: '65 lbs (29kg)' },
      { name: 'Writing Desk (150cm)', height: '29.5" (75cm)', diameter: '60" W x 30" D', weight: '88 lbs (40kg)' }
    ]
  }
];

export const SizeGuidePage = () => {
  return (
    <div className="pt-28 pb-20 bg-white min-h-screen select-none animate-fade-in">
      <div className="container max-w-3xl">
        
        {/* Title */}
        <div className="mb-12 text-center flex flex-col items-center gap-2">
          <span className="text-[0.65rem] uppercase tracking-[0.25em] font-bold text-accent-gold font-price-label">
            Scale Coordinates
          </span>
          <h1 className="font-editorial text-4xl md:text-5xl font-medium text-text-dark">
            Dimension Sizing Guide
          </h1>
          <div className="w-12 h-[1px] bg-accent-gold mt-4" />
        </div>

        {/* Door passages checklist */}
        <div className="bg-bg-light/45 border border-solid border-black/5 rounded-sm p-6 flex gap-4 items-start mb-10">
          <DoorClosed size={24} className="text-accent-gold mt-0.5 flex-shrink-0" />
          <div className="flex flex-col gap-1.5 text-xs text-text-muted leading-relaxed">
            <h4 className="font-bold text-text-dark uppercase tracking-wider flex items-center gap-1.5">
              Passage Clearances
            </h4>
            <p>
              Before purchasing major workshop furniture items (like the Nordic Oak Writing Desk), please measure door frames, hallways, and elevator entries. Our delivery teams drop off items inside crates. Ensure a minimum entry clearance of 30 inches (76cm) is available.
            </p>
          </div>
        </div>

        {/* Sizing Tables */}
        <div className="flex flex-col gap-12">
          {SIZE_GUIDES.map((section, idx) => (
            <div key={idx} className="flex flex-col gap-4">
              <h3 className="font-editorial text-xl font-bold uppercase tracking-wider border-b border-black/5 pb-2 text-text-dark">
                {section.category}
              </h3>
              
              <table className="w-full text-left text-xs border-collapse font-price-label">
                <thead>
                  <tr className="border-b border-black/10 text-text-muted uppercase tracking-wider font-bold">
                    <th className="py-2.5">Design Name</th>
                    <th className="py-2.5">Height Spec</th>
                    <th className="py-2.5">Width / Depth / Diam</th>
                    <th className="py-2.5">Dry Weight</th>
                  </tr>
                </thead>
                <tbody>
                  {section.specs.map((item, itemIdx) => (
                    <tr key={itemIdx} className="border-b border-black/5 text-text-dark">
                      <td className="py-3 font-semibold font-body text-xs">{item.name}</td>
                      <td className="py-3">{item.height}</td>
                      <td className="py-3">{item.diameter}</td>
                      <td className="py-3">{item.weight}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
export default SizeGuidePage;
