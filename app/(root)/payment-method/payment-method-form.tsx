
'use client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useTransition } from 'react';
import { paymentMethodSchema } from '@/lib/validators';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DEFAULT_PAYMENT_METHOD, PAYMENT_METHODS } from '@/lib/constants';
import { Form, FormControl, FormField, FormItem, FormLabel} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2 } from 'lucide-react';
import { z } from 'zod';                       // instead of: import z from 'zod'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { updateUserPaymentMethod } from '@/lib/actions/user.actions';



const PaymentMethodForm = ({preferredPaymentMethod}:{preferredPaymentMethod:string|null}) => {
    const [isPending, startTransition] = useTransition();

    const router = useRouter();

    const form = useForm<z.infer<typeof paymentMethodSchema>>({
        resolver: zodResolver(paymentMethodSchema),
        defaultValues: {
            type: preferredPaymentMethod || DEFAULT_PAYMENT_METHOD,
        },
    });

    const onSubmit = async (values: z.infer<typeof paymentMethodSchema>) => {
        startTransition(async ()=>{
            const res=await updateUserPaymentMethod(values);
            if(!res.success){
                toast.error(res.message || 'Failed to update payment method');
                return;
            }
            // router.push('/order-review');
            router.push('/place-order'); 
        })
    }



   return (
  <div className="max-w-md mx-auto space-y-4">
    <h1 className="h2-bold mt-4">Payment Method</h1>
    <p className="text-sm text-muted-foreground">Please enter a payment method</p>

    <Form {...form}>
      <form method="post" className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex md:flex-row flex-col gap-5">
          <FormField
            name="type"
            control={form.control}
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormControl>
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="flex flex-col space-y-3"
                  >
                    {PAYMENT_METHODS.map((method) => (
                      <FormItem key={method} className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value={method} checked={field.value === method} />
                        </FormControl>
                        <FormLabel className="font-normal">{method}</FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
            <span className="ml-2">Continue</span>
          </Button>
        </div>
      </form>
    </Form>
  </div>
);
}
 
export default PaymentMethodForm;