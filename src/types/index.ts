export interface NavItem {
  label: string;
  path: string;
  iconName?: string;
}

export interface StoreContactInfo {
  name: string;
  domain: string;
  address: {
    city: string;
    district: string;
    country: string;
    fullAddress: string;
  };
  phones: string[];
  email: string;
  openingHours: {
    days: string;
    time: string;
  }[];
}

export interface FeatureCardItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface ContactFormData {
  fullName: string;
  phone: string;
  email?: string;
  subject: string;
  message: string;
  inquiryType: 'general' | 'wholesale' | 'delivery' | 'feedback';
}
