import {redirect} from 'react-router';
import type {Route} from './+types/articles.$handle';

export async function loader({params}: Route.LoaderArgs) {
  const {handle} = params;
  if (!handle) {
    return redirect('/blogs/news', 301);
  }
  return redirect(`/blogs/news/${handle}`, 301);
}

export default function ArticleRedirect() {
  return null;
}
