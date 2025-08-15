export interface EventConfig {
  key: string;              // Routing key (e.g., "user.created")
  queue: string;            // Main queue name
  retryQueue: string;       // Retry queue name
  service: string;          // Which service is subscribing (optional filter)
}

export const EVENTS: EventConfig[] = [
  {
    key: "user.created",
    queue: "cart_user_created_queue",
    retryQueue: "cart_retry_created_queue",
    service: "cart"
  },
  {
    key: "user.deleted",
    queue: "cart_user_deleted_queue",
    retryQueue: "cart_retry_deleted_queue",
    service: "cart"
  },
  {
    key: "order.completed",
    queue: "cart_order_completed_queue",
    retryQueue: "cart_retry_order_completed_queue",
    service: "cart"
  },
  {
    key: "review.added",
    queue: "product_review_added_queue",
    retryQueue: "product_retry_review_added_queue",
    service: "product"
  }
];
