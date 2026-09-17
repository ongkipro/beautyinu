import React from 'react';
import {ChevronDown} from 'lucide-react';

export function Accordion({
  items,
}: {
  items: {title: string; content: React.ReactNode; defaultOpen?: boolean}[];
}) {
  if (!items || items.length === 0) return null;

  return (
    <div className="border-t border-black/[0.06]">
      {items.map((item, i) => (
        <details
          key={item.title || i}
          className="group border-b border-black/[0.06] py-3.5 sm:py-4 transition-colors"
          open={item.defaultOpen}
        >
          <summary className="flex w-full cursor-pointer list-none [&::-webkit-details-marker]:hidden items-center justify-between text-left select-none">
            <span className="font-sans text-sm sm:text-base font-medium tracking-tight text-text group-hover:text-primary transition-colors">
              {item.title}
            </span>
            <ChevronDown className="w-4 h-4 text-black/35 group-hover:text-text/70 transition-transform duration-300 ease-out group-open:rotate-180 flex-shrink-0" />
          </summary>
          <div className="pt-3 pb-1 text-sm sm:text-base text-text/85 leading-relaxed">
            {item.content}
          </div>
        </details>
      ))}
    </div>
  );
}
