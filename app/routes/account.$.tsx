import {redirect} from 'react-router';
import type {Route} from './+types/account.$';

// fallback wild card for all unauthenticated routes in account section
export async function loader({context}: Route.LoaderArgs) {
  if (!context.env.PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID) {
    const customerAccountUrl =
      context.env.PUBLIC_CUSTOMER_ACCOUNT_API_URL || 'https://account.beautyinu.co';
    return redirect(customerAccountUrl);
  }

  await context.customerAccount.handleAuthStatus();

  return redirect('/account');
}
