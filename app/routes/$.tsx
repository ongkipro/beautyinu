import type {Route} from './+types/$';
import {getSeoMeta} from '~/lib/seo';

export const meta: Route.MetaFunction = () => {
  return getSeoMeta({
    title: 'Page Not Found (404) — Beautyinu',
    description: 'Halaman yang Anda cari tidak ditemukan.',
    noIndex: true,
  });
};

export async function loader() {
  throw new Response('Page not found', {status: 404});
}

export default function CatchAll() {
  return null;
}
