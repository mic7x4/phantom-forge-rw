import {
  boolean,
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const userRole = pgEnum("user_role", ["customer", "admin"]);
export const orderStatus = pgEnum("order_status", [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
]);
export const paymentStatus = pgEnum("payment_status", [
  "pending",
  "paid",
  "failed",
  "refunded",
]);
export const paymentMethod = pgEnum("payment_method", [
  "mtn_momo",
  "airtel_money",
  "card",
]);

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: text("email").notNull(),
    name: text("name").notNull(),
    phone: text("phone"),
    role: userRole("role").notNull().default("customer"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [uniqueIndex("users_email_idx").on(table.email)],
);

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    image: text("image"),
    active: boolean("active").notNull().default(true),
  },
  (table) => [uniqueIndex("categories_slug_idx").on(table.slug)],
);

export const products = pgTable(
  "products",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    categoryId: uuid("category_id").references(() => categories.id),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    brand: text("brand"),
    description: text("description"),
    priceRwf: integer("price_rwf").notNull(),
    compareAtRwf: integer("compare_at_rwf"),
    sku: text("sku").notNull(),
    image: text("image"),
    active: boolean("active").notNull().default(true),
    featured: boolean("featured").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("products_slug_idx").on(table.slug),
    uniqueIndex("products_sku_idx").on(table.sku),
  ],
);

export const productImages = pgTable("product_images", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  alt: text("alt"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const inventory = pgTable("inventory", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull().default(0),
  lowStockThreshold: integer("low_stock_threshold").notNull().default(5),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const addresses = pgTable("addresses", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  label: text("label"),
  recipientName: text("recipient_name").notNull(),
  phone: text("phone").notNull(),
  district: text("district").notNull(),
  sector: text("sector"),
  street: text("street"),
  notes: text("notes"),
});

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderNumber: text("order_number").notNull(),
  userId: uuid("user_id").references(() => users.id),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  customerEmail: text("customer_email"),
  deliveryDistrict: text("delivery_district").notNull(),
  deliveryAddress: text("delivery_address").notNull(),
  subtotalRwf: integer("subtotal_rwf").notNull(),
  deliveryRwf: integer("delivery_rwf").notNull().default(0),
  discountRwf: integer("discount_rwf").notNull().default(0),
  totalRwf: integer("total_rwf").notNull(),
  status: orderStatus("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [uniqueIndex("orders_order_number_idx").on(table.orderNumber)]);

export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  productId: uuid("product_id").references(() => products.id),
  productName: text("product_name").notNull(),
  sku: text("sku").notNull(),
  quantity: integer("quantity").notNull(),
  unitPriceRwf: integer("unit_price_rwf").notNull(),
  lineTotalRwf: integer("line_total_rwf").notNull(),
});

export const payments = pgTable("payments", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  method: paymentMethod("method").notNull(),
  providerReference: text("provider_reference"),
  amountRwf: integer("amount_rwf").notNull(),
  status: paymentStatus("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const paymentEvents = pgTable("payment_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  paymentId: uuid("payment_id").references(() => payments.id, { onDelete: "cascade" }),
  provider: text("provider").notNull(),
  eventType: text("event_type").notNull(),
  providerEventId: text("provider_event_id"),
  payload: text("payload").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const discountCodes = pgTable("discount_codes", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: text("code").notNull(),
  percentOff: integer("percent_off"),
  amountOffRwf: integer("amount_off_rwf"),
  active: boolean("active").notNull().default(true),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
}, (table) => [uniqueIndex("discount_codes_code_idx").on(table.code)]);

export const deliveryZones = pgTable("delivery_zones", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  feeRwf: integer("fee_rwf").notNull(),
  active: boolean("active").notNull().default(true),
});
