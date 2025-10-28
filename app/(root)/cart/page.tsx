import type { Metadata } from 'next';
import CartTable from './cart-table';
import { getMyCart } from '@/lib/actions/cart.actions';
// import {getMyCart} from '../../../lib/actions/cart.actions';


export const metadata: Metadata = {
    title: 'Shopping Cart',
};

const CartPage = async () => {
  const cart = await getMyCart();
  return (
    <>
      <CartTable cart={cart} />
    </>
  );
};
export default CartPage;
