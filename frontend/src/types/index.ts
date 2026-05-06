export interface Order {
  id: string;
  date: string;
  customer: string;
  contact?: string;
  products: ProductItem[];
  totalAmount: number;
  advancePayment: number; // Seña
  balance: number; // Saldo
  shippingMethod: string;
  shippingAddress: string;
  isHomeDelivery: boolean;
  notes?: string;
  status: 'pending' | 'shipped';
}

export interface ProductItem {
  id: string;
  name: string;
  quantity: number;
  requiresBlacksmith: boolean;
  blacksmithCost?: number;
  blacksmithStatus?: 'not_ordered' | 'ordered' | 'completed';
}

export interface BlacksmithTask {
  id: string;
  orderId: string;
  customerName: string;
  productName: string;
  cost: number;
  status: 'not_ordered' | 'ordered' | 'completed';
  dueDate?: string;
}
