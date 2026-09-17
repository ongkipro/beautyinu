import type {CustomerFragment} from 'customer-accountapi.generated';
import type {CustomerUpdateInput} from '@shopify/hydrogen/customer-account-api-types';
import {CUSTOMER_UPDATE_MUTATION} from '~/graphql/customer-account/CustomerUpdateMutation';
import {
  data,
  Form,
  useActionData,
  useNavigation,
  useOutletContext,
} from 'react-router';
import type {Route} from './+types/account.profile';

export type ActionResponse = {
  error: string | null;
  customer: CustomerFragment | null;
};

export const meta: Route.MetaFunction = () => {
  return [{title: 'Profile'}];
};

export async function loader({context}: Route.LoaderArgs) {
  await context.customerAccount.handleAuthStatus();

  return {};
}

export async function action({request, context}: Route.ActionArgs) {
  const {customerAccount} = context;

  if (request.method !== 'PUT') {
    return data({error: 'Method not allowed'}, {status: 405});
  }

  const form = await request.formData();

  try {
    const customer: CustomerUpdateInput = {};
    const validInputKeys = ['firstName', 'lastName'] as const;
    for (const [key, value] of form.entries()) {
      if (!validInputKeys.includes(key as any)) {
        continue;
      }
      if (typeof value === 'string' && value.length) {
        customer[key as (typeof validInputKeys)[number]] = value;
      }
    }

    // update customer and possibly password
    const {data, errors} = await customerAccount.mutate(
      CUSTOMER_UPDATE_MUTATION,
      {
        variables: {
          customer,
          language: customerAccount.i18n.language,
        },
      },
    );

    if (errors?.length) {
      throw new Error(errors[0].message);
    }

    if (!data?.customerUpdate?.customer) {
      throw new Error('Customer profile update failed.');
    }

    return {
      error: null,
      customer: data?.customerUpdate?.customer,
    };
  } catch (error: any) {
    return data(
      {error: error.message, customer: null},
      {
        status: 400,
      },
    );
  }
}

export default function AccountProfile() {
  const account = useOutletContext<{customer: CustomerFragment}>();
  const {state} = useNavigation();
  const action = useActionData<ActionResponse>();
  const customer = action?.customer ?? account?.customer;

  return (
    <div className="max-w-xl rounded-3xl bg-[#FAF9FB] border border-black/[0.05] p-6 sm:p-8">
      <h2 className="font-serif text-2xl text-text font-normal tracking-tight mb-1">
        Profil Pengguna
      </h2>
      <p className="text-xs text-text-secondary mb-6 leading-relaxed">
        Perbarui nama dan informasi profil akun Beautyinu kamu.
      </p>

      <Form method="PUT" className="space-y-4">
        <div>
          <label
            htmlFor="firstName"
            className="text-xs font-mono font-medium uppercase tracking-wider text-black/60 block mb-1.5"
          >
            Nama Depan
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            autoComplete="given-name"
            placeholder="Nama Depan"
            aria-label="Nama Depan"
            defaultValue={customer.firstName ?? ''}
            minLength={2}
            className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-xs sm:text-sm text-text focus:outline-none focus:border-black transition-colors"
          />
        </div>

        <div>
          <label
            htmlFor="lastName"
            className="text-xs font-mono font-medium uppercase tracking-wider text-black/60 block mb-1.5"
          >
            Nama Belakang
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            autoComplete="family-name"
            placeholder="Nama Belakang"
            aria-label="Nama Belakang"
            defaultValue={customer.lastName ?? ''}
            minLength={2}
            className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-xs sm:text-sm text-text focus:outline-none focus:border-black transition-colors"
          />
        </div>

        {action?.error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600">
            {action.error}
          </div>
        )}

        <div className="pt-2">
          <button
            type="submit"
            disabled={state !== 'idle'}
            className="px-6 py-3 rounded-xl bg-[#111111] hover:bg-primary active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-xs hover:shadow-md hover:shadow-primary/25 disabled:opacity-50"
          >
            {state !== 'idle' ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </Form>
    </div>
  );
}
