import React from 'react';
import {cn} from '@/lib/utils';

const CheckoutSteps = ({current=0}) => {
    return ( 
        <div className="flex-between md:flex-row flex-col space-x-2 mb-10">
            {['User Login','Shipping Address','Payment Method','Place Order'].map((step, index) => (
                <React.Fragment key={step}>
                    <div className={cn('px-5 py-3 rounded-full text-center text-sm',index===current ? ' bg-emerald-200' : '')}>
                        {step}
                    </div>
                    {step!=='Place Order' && (
                        <hr className="w-24 border-t border-gray-300 mx-2" />
                    )}
                </React.Fragment>
            ))}
        </div>
     );
}

export default CheckoutSteps;