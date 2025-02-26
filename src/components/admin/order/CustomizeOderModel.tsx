import React from 'react';
import Image from 'next/image';

const CustomizeOderModel = ({ item }) => {
    const download = (url:string) => {
        // Implement download functionality here
        const link = document.createElement('a');
        link.href = url;
        link.download = url.split('/').pop(); // Set the filename based on the URL
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); 
    };

    return (
        <div className='p-4 rounded-md bg-slate-200'>
            {item && (
                <>
                    {Array.from({ length: 4 }, (_, index) => {
                        const key = `name${index}`;
                        return (
                            item[key] && (
                                <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                                    <p>{`Name-${index}`}</p>
                                    <p>{item[key]}</p>
                                </div>
                            )
                        );
                    })}
                    {
                        item?.selectedDesign && (
                            <div className="flex items-center justify-between py-2 border-b last:border-0">
                                <p>Selected Design</p>
                                <p>{item?.selectedDesign}</p>
                            </div>
                        )
                    }

                    <div className='flex space-x-3'>
                        {item?.previewImage && (
                            <Image
                                onClick={() => download(item?.previewImage.url)}
                                alt="img"
                                src={item?.previewImage?.url || 'https://res.cloudinary.com/dkprths9f/image/upload/v1737632594/elementor-placeholder-image_wps86z.webp'}
                                width={400}
                                height={400}
                                className="rounded-md w-[50%] h-[200px] object-cover"
                            />
                        )}
                        {item?.previewCanvas && (
                            <Image
                                onClick={() => download(item?.previewCanvas.url)}
                                alt="img"
                                src={item?.previewCanvas?.url || 'https://res.cloudinary.com/dkprths9f/image/upload/v1737632594/elementor-placeholder-image_wps86z.webp'}
                                width={400}
                                height={400}
                                className="rounded-md w-[50%] h-[200px] object-cover"
                            />
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default CustomizeOderModel;