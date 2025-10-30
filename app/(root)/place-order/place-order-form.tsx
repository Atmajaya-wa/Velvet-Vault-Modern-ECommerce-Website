'use client';
import {createOrder} from '@/lib/actions/order.actions';
import { useRouter } from 'next/navigation';
// import { toast } from 'sonner';
// import { use, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import {useFormStatus} from 'react-dom';
import {Check} from 'lucide-react';


const PlaceOrderForm = () => {
    const router = useRouter();
    const handleSubmit = async (event:React.FormEvent)=>{
        event.preventDefault();
        const res = await createOrder();
        if(res.redirectTo){
            router.push(res.redirectTo);
            
        }
    }
    const PlaceOrderButton=()=>{ 
        const {pending}=useFormStatus();
        return(
            <Button className="w-full" disabled={pending}>
                {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} <span className="ml-2">Place Order</span>
            </Button>
        )
    } 

    return <>
        <form onSubmit={handleSubmit} className='w-full'>
            <PlaceOrderButton />

        </form>
    </>;
}

export default PlaceOrderForm;