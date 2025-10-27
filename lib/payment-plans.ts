export interface PaymentPlan {
    id: string;
    name: string;
    storageLimit: number; // in MB
    price: number; // in INR
    description: string;
  }
  
  export const PAYMENT_PLANS: PaymentPlan[] = [
    {
      id: 'basic',
      name: 'Basic',
      storageLimit: 10,
      price: 0,
      description: 'Free - 10MB Storage'
    },
    {
      id: 'pro-50',
      name: 'Pro 50',
      storageLimit: 50,
      price: 20,
      description: '₹20 - 50MB Storage'
    },
    {
      id: 'pro-100',
      name: 'Pro 100',
      storageLimit: 100,
      price: 50,
      description: '₹50 - 100MB Storage'
    }
  ];
  
  export const FREE_STORAGE_LIMIT = 10; // MB