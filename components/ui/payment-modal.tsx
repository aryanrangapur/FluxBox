'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, CreditCard, Smartphone, Building, Check } from "lucide-react";

interface PaymentPlan {
  id: string;
  name: string;
  storageLimit: number;
  price: number;
  description: string;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUsage: number;
  onPlanSelect: (plan: PaymentPlan) => void;
  userStorageLimit: number;
}

const PAYMENT_PLANS: PaymentPlan[] = [
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

export default function PaymentModal({ isOpen, onClose, currentUsage, onPlanSelect, userStorageLimit }: PaymentModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<string>('pro-50');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');

  if (!isOpen) return null;

  const paidPlans = PAYMENT_PLANS.filter(plan => plan.price > 0 && plan.storageLimit > userStorageLimit);
  const selectedPlanData = paidPlans.find(plan => plan.id === selectedPlan) || paidPlans[0];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Upgrade Your Storage</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Current Usage */}
        <div className="p-6 border-b">
          <div className="text-sm text-gray-600 mb-2">Current Usage</div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-red-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((currentUsage / userStorageLimit) * 100, 100)}%` }}
            ></div>
          </div>
          <div className="text-sm text-gray-600 mt-1">
            {currentUsage.toFixed(1)}MB / {userStorageLimit}MB used
          </div>
        </div>

        {/* Plan Selection */}
        <div className="p-6 border-b">
          <h3 className="font-medium mb-4">Choose a Plan</h3>
          <div className="space-y-3">
            {paidPlans.map((plan) => (
              <div
                key={plan.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedPlan === plan.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      selectedPlan === plan.id ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                    }`}>
                      {selectedPlan === plan.id && <Check className="h-3 w-3 text-white" />}
                    </div>
                    <div>
                      <div className="font-medium">{plan.name}</div>
                      <div className="text-sm text-gray-600">{plan.description}</div>
                    </div>
                  </div>
                  <div className="text-lg font-semibold">₹{plan.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Method */}
        <div className="p-6 border-b">
          <h3 className="font-medium mb-4">Payment Method</h3>
          <div className="space-y-3">
            <div
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                paymentMethod === 'upi'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setPaymentMethod('upi')}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  paymentMethod === 'upi' ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                }`}>
                  {paymentMethod === 'upi' && <Check className="h-3 w-3 text-white" />}
                </div>
                <Smartphone className="h-5 w-5" />
                <span>UPI Payment</span>
              </div>
            </div>

            <div
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                paymentMethod === 'card'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setPaymentMethod('card')}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  paymentMethod === 'card' ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                }`}>
                  {paymentMethod === 'card' && <Check className="h-3 w-3 text-white" />}
                </div>
                <CreditCard className="h-5 w-5" />
                <span>Credit/Debit Card</span>
              </div>
            </div>

            <div
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                paymentMethod === 'netbanking'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setPaymentMethod('netbanking')}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  paymentMethod === 'netbanking' ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                }`}>
                  {paymentMethod === 'netbanking' && <Check className="h-3 w-3 text-white" />}
                </div>
                <Building className="h-5 w-5" />
                <span>Net Banking</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={() => onPlanSelect(selectedPlanData)}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            Pay ₹{selectedPlanData.price}
          </Button>
        </div>
      </div>
    </div>
  );
}