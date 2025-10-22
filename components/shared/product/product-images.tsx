'use client';
import {cn} from '@/lib/utils';
import Image from 'next/image';
import { useState } from 'react';

const ProductImages = ({images}: {images: string[]}) => {
    const [currentImage, setCurrentImage] = useState(0);

    return (
        <div className='space-y-4'>
            <Image
            src={images[currentImage]}
            alt='Product Image'
            width={1000}
            height={1000}
            className='min-h-[300px] object-cover object-center'
            />

            <div className="flex">
                {
                    images.map((image, index) => (
                        <div 
                        className={cn('border mr-2 cursor-pointer hover:border-orange-300', currentImage === index && 'border-orange-300')}
                         key={index}>
                            <Image
                            src={image}
                            alt='Thumbnail Image'
                            width={100}
                            height={100}
                            onClick={() => setCurrentImage(index)}
                            />
                        </div>
                    ))
                }
            </div>
        </div>
    );
}
 
export default ProductImages;
