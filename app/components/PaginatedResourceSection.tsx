import * as React from 'react';
import {Pagination} from '@shopify/hydrogen';

/**
 * <PaginatedResourceSection> encapsulates the previous and next pagination behaviors throughout your application.
 */
export function PaginatedResourceSection<NodesType>({
  connection,
  children,
  ariaLabel,
  resourcesClassName,
  loadMoreText = 'Muat Lebih Banyak',
  loadPreviousText = 'Muat Sebelumnya',
}: {
  connection: React.ComponentProps<typeof Pagination<NodesType>>['connection'];
  children: React.FunctionComponent<{node: NodesType; index: number}>;
  ariaLabel?: string;
  resourcesClassName?: string;
  loadMoreText?: string;
  loadPreviousText?: string;
}) {
  return (
    <Pagination connection={connection}>
      {({nodes, isLoading, PreviousLink, NextLink}) => {
        const resourcesMarkup = nodes.map((node, index) =>
          children({node, index}),
        );

        return (
          <div className="w-full">
            <div className="flex justify-center mb-8">
              <PreviousLink className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FAF8FC] hover:bg-[#F3EEFA] text-text hover:text-primary px-6 py-2.5 text-xs sm:text-sm font-semibold transition-all shadow-2xs border border-black/[0.04] cursor-pointer">
                {isLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    <span>Memuat...</span>
                  </span>
                ) : (
                  <span>↑ {loadPreviousText}</span>
                )}
              </PreviousLink>
            </div>

            {resourcesClassName ? (
              <div
                aria-label={ariaLabel}
                className={resourcesClassName}
                role={ariaLabel ? 'region' : undefined}
              >
                {resourcesMarkup}
              </div>
            ) : (
              resourcesMarkup
            )}

            <div className="flex justify-center mt-12 mb-4">
              <NextLink className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#FAF8FC] hover:bg-[#F3EEFA] text-text hover:text-primary px-8 py-3.5 text-xs sm:text-sm font-semibold transition-all shadow-2xs border border-black/[0.04] hover:shadow-xs cursor-pointer group">
                {isLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    <span>Memuat konten...</span>
                  </span>
                ) : (
                  <span>
                    {loadMoreText}{' '}
                    <span className="inline-block transition-transform duration-200 group-hover:translate-y-0.5">
                      ↓
                    </span>
                  </span>
                )}
              </NextLink>
            </div>
          </div>
        );
      }}
    </Pagination>
  );
}
