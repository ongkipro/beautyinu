import {redirect} from 'react-router';
import type {Route} from './+types/account_.login';

export async function loader({request, context}: Route.LoaderArgs) {
  const customerAccountUrl =
    context.env.PUBLIC_CUSTOMER_ACCOUNT_API_URL || 'https://account.beautyinu.co';

  if (!context.env.PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID) {
    return redirect(customerAccountUrl);
  }

  const url = new URL(request.url);
  const acrValues = url.searchParams.get('acr_values') || undefined;
  const loginHint = url.searchParams.get('login_hint') || undefined;
  const loginHintMode = url.searchParams.get('login_hint_mode') || undefined;
  const locale = url.searchParams.get('locale') || undefined;

  return context.customerAccount.login({
    countryCode: context.storefront.i18n.country,
    acrValues,
    loginHint,
    loginHintMode,
    locale,
  });
}
