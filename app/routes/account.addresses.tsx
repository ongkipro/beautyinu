import type {CustomerAddressInput} from '@shopify/hydrogen/customer-account-api-types';
import type {
  AddressFragment,
  CustomerFragment,
} from 'customer-accountapi.generated';
import {
  data,
  Form,
  useActionData,
  useNavigation,
  useOutletContext,
  type Fetcher,
} from 'react-router';
import type {Route} from './+types/account.addresses';
import {
  UPDATE_ADDRESS_MUTATION,
  DELETE_ADDRESS_MUTATION,
  CREATE_ADDRESS_MUTATION,
} from '~/graphql/customer-account/CustomerAddressMutations';

export type ActionResponse = {
  addressId?: string | null;
  createdAddress?: AddressFragment;
  defaultAddress?: string | null;
  deletedAddress?: string | null;
  error: Record<AddressFragment['id'], string> | null;
  updatedAddress?: AddressFragment;
};

export const meta: Route.MetaFunction = () => {
  return [{title: 'Addresses'}];
};

export async function loader({context}: Route.LoaderArgs) {
  await context.customerAccount.handleAuthStatus();

  return {};
}

export async function action({request, context}: Route.ActionArgs) {
  const {customerAccount} = context;

  try {
    const form = await request.formData();

    const addressId = form.has('addressId')
      ? String(form.get('addressId'))
      : null;
    if (!addressId) {
      throw new Error('You must provide an address id.');
    }

    // this will ensure redirecting to login never happen for mutatation
    const isLoggedIn = await customerAccount.isLoggedIn();
    if (!isLoggedIn) {
      return data(
        {error: {[addressId]: 'Unauthorized'}},
        {
          status: 401,
        },
      );
    }

    const defaultAddress = form.has('defaultAddress')
      ? String(form.get('defaultAddress')) === 'on'
      : false;
    const address: CustomerAddressInput = {};
    const keys: (keyof CustomerAddressInput)[] = [
      'address1',
      'address2',
      'city',
      'company',
      'territoryCode',
      'firstName',
      'lastName',
      'phoneNumber',
      'zoneCode',
      'zip',
    ];

    for (const key of keys) {
      const value = form.get(key);
      if (typeof value === 'string') {
        address[key] = value;
      }
    }

    switch (request.method) {
      case 'POST': {
        // handle new address creation
        try {
          const {data, errors} = await customerAccount.mutate(
            CREATE_ADDRESS_MUTATION,
            {
              variables: {
                address,
                defaultAddress,
                language: customerAccount.i18n.language,
              },
            },
          );

          if (errors?.length) {
            throw new Error(errors[0].message);
          }

          if (data?.customerAddressCreate?.userErrors?.length) {
            throw new Error(data?.customerAddressCreate?.userErrors[0].message);
          }

          if (!data?.customerAddressCreate?.customerAddress) {
            throw new Error('Customer address create failed.');
          }

          return {
            error: null,
            createdAddress: data?.customerAddressCreate?.customerAddress,
            defaultAddress,
          };
        } catch (error: unknown) {
          if (error instanceof Error) {
            return data(
              {error: {[addressId]: error.message}},
              {
                status: 400,
              },
            );
          }
          return data(
            {error: {[addressId]: error}},
            {
              status: 400,
            },
          );
        }
      }

      case 'PUT': {
        // handle address updates
        try {
          const {data, errors} = await customerAccount.mutate(
            UPDATE_ADDRESS_MUTATION,
            {
              variables: {
                address,
                addressId: decodeURIComponent(addressId),
                defaultAddress,
                language: customerAccount.i18n.language,
              },
            },
          );

          if (errors?.length) {
            throw new Error(errors[0].message);
          }

          if (data?.customerAddressUpdate?.userErrors?.length) {
            throw new Error(data?.customerAddressUpdate?.userErrors[0].message);
          }

          if (!data?.customerAddressUpdate?.customerAddress) {
            throw new Error('Customer address update failed.');
          }

          return {
            error: null,
            updatedAddress: address,
            defaultAddress,
          };
        } catch (error: unknown) {
          if (error instanceof Error) {
            return data(
              {error: {[addressId]: error.message}},
              {
                status: 400,
              },
            );
          }
          return data(
            {error: {[addressId]: error}},
            {
              status: 400,
            },
          );
        }
      }

      case 'DELETE': {
        // handles address deletion
        try {
          const {data, errors} = await customerAccount.mutate(
            DELETE_ADDRESS_MUTATION,
            {
              variables: {
                addressId: decodeURIComponent(addressId),
                language: customerAccount.i18n.language,
              },
            },
          );

          if (errors?.length) {
            throw new Error(errors[0].message);
          }

          if (data?.customerAddressDelete?.userErrors?.length) {
            throw new Error(data?.customerAddressDelete?.userErrors[0].message);
          }

          if (!data?.customerAddressDelete?.deletedAddressId) {
            throw new Error('Customer address delete failed.');
          }

          return {error: null, deletedAddress: addressId};
        } catch (error: unknown) {
          if (error instanceof Error) {
            return data(
              {error: {[addressId]: error.message}},
              {
                status: 400,
              },
            );
          }
          return data(
            {error: {[addressId]: error}},
            {
              status: 400,
            },
          );
        }
      }

      default: {
        return data(
          {error: {[addressId]: 'Method not allowed'}},
          {
            status: 405,
          },
        );
      }
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return data(
        {error: error.message},
        {
          status: 400,
        },
      );
    }
    return data(
      {error},
      {
        status: 400,
      },
    );
  }
}

export default function Addresses() {
  const {customer} = useOutletContext<{customer: CustomerFragment}>();
  const {defaultAddress, addresses} = customer;

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h2 className="font-serif text-2xl text-text font-normal tracking-tight mb-1">
          Buku Alamat Pengiriman
        </h2>
        <p className="text-xs text-text-secondary leading-relaxed">
          Kelola alamat pengiriman untuk kemudahan proses checkout pesananmu.
        </p>
      </div>

      <div className="space-y-8">
        {/* Create Address Form */}
        <div className="rounded-3xl bg-[#FAF9FB] border border-black/[0.05] p-6 sm:p-8">
          <h3 className="font-serif text-lg text-text font-normal mb-4">
            Tambah Alamat Baru
          </h3>
          <NewAddressForm key={addresses.nodes.length} />
        </div>

        {/* Existing Addresses */}
        <div>
          <h3 className="font-serif text-lg text-text font-normal mb-4">
            Daftar Alamat Tersimpan
          </h3>
          {!addresses.nodes.length ? (
            <div className="rounded-2xl bg-[#FAF9FB] border border-black/[0.04] p-8 text-center text-xs text-text-secondary">
              Belum ada alamat yang tersimpan.
            </div>
          ) : (
            <ExistingAddresses
              addresses={addresses}
              defaultAddress={defaultAddress}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function NewAddressForm() {
  const newAddress = {
    address1: '',
    address2: '',
    city: '',
    company: '',
    territoryCode: 'ID',
    firstName: '',
    id: 'new',
    lastName: '',
    phoneNumber: '',
    zoneCode: '',
    zip: '',
  } as CustomerAddressInput;

  return (
    <AddressForm
      addressId={'NEW_ADDRESS_ID'}
      address={newAddress}
      defaultAddress={null}
    >
      {({stateForMethod}) => (
        <div className="pt-2">
          <button
            disabled={stateForMethod('POST') !== 'idle'}
            formMethod="POST"
            type="submit"
            className="px-6 py-3 rounded-xl bg-[#111111] hover:bg-primary active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-xs hover:shadow-md hover:shadow-primary/25 disabled:opacity-50"
          >
            {stateForMethod('POST') !== 'idle' ? 'Menyimpan...' : 'Simpan Alamat Baru'}
          </button>
        </div>
      )}
    </AddressForm>
  );
}

function ExistingAddresses({
  addresses,
  defaultAddress,
}: Pick<CustomerFragment, 'addresses' | 'defaultAddress'>) {
  return (
    <div className="space-y-6">
      {addresses.nodes.map((address) => (
        <div
          key={address.id}
          className="rounded-3xl bg-[#FAF9FB] border border-black/[0.05] p-6 sm:p-8"
        >
          <AddressForm
            addressId={address.id}
            address={address}
            defaultAddress={defaultAddress}
          >
            {({stateForMethod}) => (
              <div className="pt-2 flex items-center gap-3">
                <button
                  disabled={stateForMethod('PUT') !== 'idle'}
                  formMethod="PUT"
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#111111] hover:bg-primary active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-xs hover:shadow-md hover:shadow-primary/25 disabled:opacity-50"
                >
                  {stateForMethod('PUT') !== 'idle' ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
                <button
                  disabled={stateForMethod('DELETE') !== 'idle'}
                  formMethod="DELETE"
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-white hover:bg-rose-50 text-black/60 hover:text-rose-600 hover:border-rose-200 border border-black/10 text-xs font-semibold transition-all duration-200 cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  {stateForMethod('DELETE') !== 'idle' ? 'Menghapus...' : 'Hapus'}
                </button>
              </div>
            )}
          </AddressForm>
        </div>
      ))}
    </div>
  );
}

export function AddressForm({
  addressId,
  address,
  defaultAddress,
  children,
}: {
  addressId: AddressFragment['id'];
  address: CustomerAddressInput;
  defaultAddress: CustomerFragment['defaultAddress'];
  children: (props: {
    stateForMethod: (method: 'PUT' | 'POST' | 'DELETE') => Fetcher['state'];
  }) => React.ReactNode;
}) {
  const {state, formMethod} = useNavigation();
  const action = useActionData<ActionResponse>();
  const error = action?.error?.[addressId];
  const isDefaultAddress = defaultAddress?.id === addressId;

  const labelClass =
    'text-xs font-mono font-medium uppercase tracking-wider text-black/60 block mb-1.5';
  const inputClass =
    'w-full px-4 py-2.5 bg-white border border-black/10 rounded-xl text-xs sm:text-sm text-text focus:outline-none focus:border-black transition-colors';

  return (
    <Form id={addressId} className="space-y-4">
      <input type="hidden" name="addressId" defaultValue={addressId} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor={`firstName-${addressId}`} className={labelClass}>
            Nama Depan*
          </label>
          <input
            id={`firstName-${addressId}`}
            name="firstName"
            type="text"
            autoComplete="given-name"
            defaultValue={address?.firstName ?? ''}
            placeholder="Nama Depan"
            required
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor={`lastName-${addressId}`} className={labelClass}>
            Nama Belakang*
          </label>
          <input
            id={`lastName-${addressId}`}
            name="lastName"
            type="text"
            autoComplete="family-name"
            defaultValue={address?.lastName ?? ''}
            placeholder="Nama Belakang"
            required
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor={`phoneNumber-${addressId}`} className={labelClass}>
            Nomor Telepon
          </label>
          <input
            id={`phoneNumber-${addressId}`}
            name="phoneNumber"
            type="tel"
            autoComplete="tel"
            defaultValue={address?.phoneNumber ?? ''}
            placeholder="081234567890"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor={`company-${addressId}`} className={labelClass}>
            Perusahaan (Opsional)
          </label>
          <input
            id={`company-${addressId}`}
            name="company"
            type="text"
            autoComplete="organization"
            defaultValue={address?.company ?? ''}
            placeholder="Nama Kantor/Perusahaan"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor={`address1-${addressId}`} className={labelClass}>
          Alamat Lengkap (Jalan, RT/RW, No. Rumah)*
        </label>
        <input
          id={`address1-${addressId}`}
          name="address1"
          type="text"
          autoComplete="address-line1"
          defaultValue={address?.address1 ?? ''}
          placeholder="Jl. Raya No. 123"
          required
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor={`address2-${addressId}`} className={labelClass}>
          Detail Tambahan (Gedung, Lantai, Patokan)
        </label>
        <input
          id={`address2-${addressId}`}
          name="address2"
          type="text"
          autoComplete="address-line2"
          defaultValue={address?.address2 ?? ''}
          placeholder="Blok / Unit / Patokan"
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor={`city-${addressId}`} className={labelClass}>
            Kota / Kabupaten*
          </label>
          <input
            id={`city-${addressId}`}
            name="city"
            type="text"
            autoComplete="address-level2"
            defaultValue={address?.city ?? ''}
            placeholder="Surabaya"
            required
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor={`zoneCode-${addressId}`} className={labelClass}>
            Provinsi*
          </label>
          <input
            id={`zoneCode-${addressId}`}
            name="zoneCode"
            type="text"
            autoComplete="address-level1"
            defaultValue={address?.zoneCode ?? ''}
            placeholder="Jawa Timur"
            required
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor={`zip-${addressId}`} className={labelClass}>
            Kode Pos*
          </label>
          <input
            id={`zip-${addressId}`}
            name="zip"
            type="text"
            autoComplete="postal-code"
            defaultValue={address?.zip ?? ''}
            placeholder="60111"
            required
            className={inputClass}
          />
        </div>
      </div>

      <input
        type="hidden"
        name="territoryCode"
        defaultValue={address?.territoryCode || 'ID'}
      />

      <div className="flex items-center gap-2 pt-1">
        <input
          id={`defaultAddress-${addressId}`}
          name="defaultAddress"
          type="checkbox"
          defaultChecked={isDefaultAddress}
          className="rounded border-black/20 text-black focus:ring-black w-4 h-4 cursor-pointer"
        />
        <label
          htmlFor={`defaultAddress-${addressId}`}
          className="text-xs text-text cursor-pointer select-none"
        >
          Jadikan alamat utama
        </label>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600">
          {error}
        </div>
      )}

      {children({
        stateForMethod: (method) => (formMethod === method ? state : 'idle'),
      })}
    </Form>
  );
}
