import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

const FAQ_DATA = [
  {
    category: 'Ordering & Customizations',
    items: [
      {
        q: 'Do you offer custom sizing configurations for your oak or stone tables?',
        a: 'Yes. Every timber piece can be customized to length and width constraints. Please submit your request details via our Contact form or email the studio at consultation@kino.design for custom quote logs.'
      },
      {
        q: 'Can I cancel or modify my order after authorization?',
        a: 'Because our workshop teams begin select stone carving and oak joinery processing immediately upon order validation, modifications are permitted only within 24 hours of placement.'
      }
    ]
  },
  {
    category: 'Materials & Sourcing',
    items: [
      {
        q: 'Why are there natural holes and grooves in my Travertine pieces?',
        a: 'Italian Travertine is formed in geothermal springs. The characteristic voids, holes, and texture pores are completely organic and represent natural history. We leave these holes un-filled to honor the honest structure of the stone.'
      },
      {
        q: 'Where do you source your solid oak wood logs?',
        a: 'Our solid white oak logs are harvested from FSC-certified sustainable forests in Denmark and northern Germany, tracking a strict tree-planting replacement ratio.'
      }
    ]
  },
  {
    category: 'Shipping & Delivery assisting',
    items: [
      {
        q: 'How long will it take for my order to be dispatched?',
        a: 'Bespoke items (Lounge Chair, Writing Desk) take between 2 to 3 weeks for hand finishing. Home accessories (Travertine Vessel, Lighting) are dispatched from Copenhagen warehouses in 2-4 business days.'
      },
      {
        q: 'Do you offer global shipping and customs clearance?',
        a: 'We ship worldwide. International shipping rates are calculated at checkout. Customs, duties, and import fees are handled by our shipping carriers during import clearance, ensuring standard delivery to your door.'
      }
    ]
  },
  {
    category: 'Returns & Warranties',
    items: [
      {
        q: 'What is your returns policy?',
        a: 'We accept returns on all standard collections within 30 days of arrival. Items must be returned in their original wooden crates or secure boxes. Custom/bespoke sizing orders are final sale.'
      },
      {
        q: 'Is there a warranty on furniture joinery?',
        a: 'All Kino Atelier furniture pieces carry a 10-year warranty against structural failures or wood joint breaks under regular residential conditions.'
      }
    ]
  }
];

export const FAQPage = () => {
  const [openIndexes, setOpenIndexes] = useState({});

  const toggleFAQ = (catIdx, itemIdx) => {
    const key = `${catIdx}-${itemIdx}`;
    setOpenIndexes((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="pt-28 pb-20 bg-white min-h-screen select-none animate-fade-in">
      <div className="container max-w-3xl">
        
        {/* Title */}
        <div className="mb-12 text-center flex flex-col items-center gap-2">
          <span className="text-[0.65rem] uppercase tracking-[0.25em] font-bold text-accent-gold font-price-label">
            Objections & Answers
          </span>
          <h1 className="font-editorial text-4xl md:text-5xl font-medium text-text-dark">
            Frequently Asked Queries
          </h1>
          <div className="w-12 h-[1px] bg-accent-gold mt-4" />
        </div>

        {/* FAQ list */}
        <div className="flex flex-col gap-10">
          {FAQ_DATA.map((cat, catIdx) => (
            <div key={catIdx} className="flex flex-col gap-4">
              <h3 className="font-editorial text-xl font-bold uppercase tracking-wider border-b border-black/5 pb-2 text-text-dark">
                {cat.category}
              </h3>
              
              <div className="flex flex-col gap-3">
                {cat.items.map((item, itemIdx) => {
                  const isOpen = !!openIndexes[`${catIdx}-${itemIdx}`];
                  return (
                    <div
                      key={itemIdx}
                      className="border border-solid border-black/5 rounded-sm p-4 hover:border-black/20 transition-all duration-300"
                    >
                      <button
                        onClick={() => toggleFAQ(catIdx, itemIdx)}
                        className="w-full flex items-center justify-between text-left gap-4 font-bold text-xs uppercase tracking-wider text-text-dark"
                      >
                        <span className="flex items-center gap-2.5">
                          <HelpCircle size={14} className="text-accent-gold flex-shrink-0" />
                          {item.q}
                        </span>
                        {isOpen ? <ChevronUp size={14} className="text-text-muted" /> : <ChevronDown size={14} className="text-text-muted" />}
                      </button>
                      
                      {isOpen && (
                        <p className="text-xs text-text-muted mt-3 pt-3 border-t border-black/5 leading-relaxed animate-fade-in">
                          {item.a}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
export default FAQPage;
