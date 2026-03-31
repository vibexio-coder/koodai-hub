// ─── Central services index ───────────────────────────────────────────────────
// Import all services from one place:
//   import { vendorService, orderService } from '@/services';
// OR individual:
//   import vendorService from '@/services/vendorService';

export { default as apiClient }       from './apiClient.js';
export { default as categoryService } from './categoryService.js';
export { default as vendorService, mapVendorToUI }   from './vendorService.js';
export { default as orderService }    from './orderService.js';
export { default as deliveryService } from './deliveryService.js';
export { default as paymentService }  from './paymentService.js';
export { default as dashboardService }from './dashboardService.js';
