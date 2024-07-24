export interface Payment {
  _id: string;
  userId: string;
  orderId: string;
  paymentId: string;
  amount: number;
  razorpay_payment_id: any;
  razorpay_order_id: any;
  razorpay_signature: any;
  createdAt: string;
  updatedAt: string;
}
