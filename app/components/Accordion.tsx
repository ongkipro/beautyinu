import React from 'react';
import {ChevronDown} from 'lucide-react';

export function Accordion({
  items,
}: {
  items: {title: string; content: React.ReactNode; defaultOpen?: boolean}[];
}) {
  return (
    <div className="space-y-3 mt-8">
      {items.map((item, i) => (
        <details key={i} className="group rounded-2xl bg-[#FAF8FC] p-4 sm:p-5" open={item.defaultOpen}>
          <summary className="flex w-full cursor-pointer list-none items-center justify-between text-left font-serif text-base sm:text-lg text-text select-none">
            <span>{item.title}</span>
            <ChevronDown className="w-4 h-4 text-text-secondary transition-transform duration-200 group-open:rotate-180 flex-shrink-0" />
          </summary>
          <div className="mt-3 text-text-secondary text-sm leading-relaxed [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1">
            {item.content}
          </div>
        </details>
      ))}
    </div>
  );
}
