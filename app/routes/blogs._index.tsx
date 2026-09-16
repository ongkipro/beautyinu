import {redirect} from 'react-router';
import type {Route} from './+types/blogs._index';

/**
 * Beautyinu has a single blog ("News").
 * Redirect /blogs to /blogs/news directly.
 */
export async function loader({}: Route.LoaderArgs) {
  return redirect('/blogs/news');
}

export default function Blogs() {
  return null;
}
