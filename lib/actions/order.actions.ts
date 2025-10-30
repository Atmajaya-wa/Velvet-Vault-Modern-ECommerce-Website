'use server';

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { convertToPlainObject, formatError } from "../utils";
import { auth } from "@/auth";
import { getMyCart } from "./cart.actions";
import { getUserById } from "./user.actions";
import { insertOrderSchema } from "../validators";
import { prisma } from "@/db/prisma";
import { CartItem } from "@/types";




// Create the order and order Items

export async function createOrder() {
  // Implementation will go here
  try{
    const session = await auth();
    if(!session) throw new Error('User not authenticated');
    const cart = await getMyCart();
    const userId = session?.user?.id;
    if(!userId) throw new Error('User ID not found in session');
    
    const user = await getUserById(userId);
    if(!cart || cart.items.length === 0) {
        return{
            success:false,
            message:'Cart is empty',
            redirectTo:'./cart'
        }
    }
    if(!user.addresses) {
        return{
            success:false,
            message:'User has no shipping address',
            redirectTo:'./shipping-address'
        }
    }
    if(!user.paymentMethod) {
        return{
            success:false,
            message:'User has no payment method',
            redirectTo:'./payment-method'
        }
    }
    // Create Order and Order Items here
    const order = insertOrderSchema.parse({
        userId: user.id,
        shippingAddress: user.addresses,
        paymentMethod: user.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
    
    });

    // Create a transaction to insert order and order items in db
   const insertedOrderId = await prisma.$transaction(async (tx) => {
        const insertedOrder = await tx.order.create({
            data:order
        })
        for(const item of cart.items as CartItem[]){
            await tx.orderItem.create({
                data:{
                    ...item,
                    price:item.price,
                    orderId: insertedOrder.id
                }
            })
        }
        
        await tx.cart.update({
            where:{id:cart.id},
            data:{
                items:[],
                itemsPrice:0,
                shippingPrice:0,
                taxPrice:0,
                totalPrice:0
            }
        })

        return insertedOrder.id;

    })

     if(!insertedOrderId) {
        throw new Error('Order creation failed');
     }
     return { 
        success:true,
        message:'Order created successfully',
        redirectTo:`/order/${insertedOrderId}`
     }

  }
  catch(error){
    if(isRedirectError(error)) throw error ;
    return{
        success:false,
        message: formatError(error)
    }
}
}

// Get order id
 export async function getOrderById(orderId:string){
    const data = await prisma.order.findUnique({
        where:{id:orderId},
        include:{
            OrderItem:true,
            user:{select:{email:true,name:true}}

        }
    });
    return convertToPlainObject(data);
 }