import { useState } from 'react';
import { STORE_INFO, NAV_ITEMS } from '../utils/constants';

export function useStoreInfo() {
  const [storeInfo] = useState(STORE_INFO);
  const [navItems] = useState(NAV_ITEMS);

  return {
    storeInfo,
    navItems,
    primaryPhone: storeInfo.phones[0],
    secondaryPhone: storeInfo.phones[1],
    fullAddress: storeInfo.address.fullAddress,
    cityName: storeInfo.address.city,
    districtName: storeInfo.address.district,
  };
}
