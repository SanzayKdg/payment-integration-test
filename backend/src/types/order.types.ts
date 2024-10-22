export enum PaymentMethod {
  cash = "cash",
  khalti = "khalti",
  esewa = "esewa",
}

export enum OrderStatus {
  processing = "processing",
  shipped = "shipped",
  delivered = "delivered",
  rejected = "rejected",
  cancelled = "cancelled",
}

export enum PaymentStatus {
  pending = "pending",
  completed = "completed",
  refunded = "refunded",
  success = "success",
  failed = "failed",
}
