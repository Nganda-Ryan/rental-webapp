import React from 'react';
import { HomeIcon, HomeModernIcon } from '@heroicons/react/20/solid';
import { PropertyTileType } from '@/types/tileTypes';

const PropertyTile = ({ header, body} : PropertyTileType) => {
  return (
    <div className='flex flex-nowrap items-center bg-slate-50 rounded-sm min-w-60 maw-w-80 p-2 drop-shadow-1 m-2 dark:bg-gray-700'>
        <div className='w-1/3 flex justify-center'>
            <HomeIcon className="size-13 fill-slate-300 dark:fill-slate-400"/>
        </div>
        <div className='w-2/3 flex flex-col justify-start'>
            <div className='text-xs font-bold text-slate-700 dark:text-slate-100'>{header}</div>
            <div className='-mb-2 font-bold text-slate-500 text-lg dark:text-slate-200'>{body}</div>
        </div>
    </div>
  )
}

export default PropertyTile