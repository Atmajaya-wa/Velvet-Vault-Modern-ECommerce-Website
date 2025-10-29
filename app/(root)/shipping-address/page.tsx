import {auth} from '@/auth';
import {getMyCart} from '@/lib/actions/cart.actions'; ;
import{Metadata} from 'next';
import {redirect} from 'next/navigation';
import {ShippingAddress} from '@/types';
import { getUserById } from '@/lib/actions/user.actions';
import ShippingAddressForm from './shipping-address-form';
import CheckoutSteps from '@/components/shared/checkout-steps';




export const metadata: Metadata = {
    title: 'Shipping Address'
}


const ShippingAddressPage = async () => {
    const cart = await getMyCart();
    if(!cart || cart.items.length === 0){
        redirect('/cart');
    }

    const session = await auth();
    const userId= session?.user?.id;

    if(!userId){
       throw new Error('No User ID found in session');
    }

    const user = await getUserById(userId);


      // 👉 আমরা single JSON object ধরে নিচ্ছি:
  const address = (user.addresses ?? null) as unknown as ShippingAddress | null;
  return <>
  <CheckoutSteps current={1}/>
  <ShippingAddressForm address={address ?? undefined} />;
  </>
  
}

export default ShippingAddressPage;