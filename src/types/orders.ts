export interface OrderState {
  nhcLastOrderDate: string | null; // Date ISO (ex: "2026-08-01")
  pharmacyLastOrderDate: string | null;
}

export const ORDER_INTERVAL_DAYS = 30;
