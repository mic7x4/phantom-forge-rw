CREATE TYPE "user_role" AS ENUM ('customer', 'admin');
CREATE TYPE "order_status" AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled');
CREATE TYPE "payment_status" AS ENUM ('pending', 'paid', 'failed', 'refunded');
CREATE TYPE "payment_method" AS ENUM ('mtn_momo', 'airtel_money', 'card');

CREATE TABLE "users" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "email" text NOT NULL,
  "name" text NOT NULL,
  "phone" text,
  "role" "user_role" NOT NULL DEFAULT 'customer',
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX "users_email_idx" ON "users" ("email");

CREATE TABLE "categories" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" text NOT NULL,
  "slug" text NOT NULL,
  "description" text,
  "image" text,
  "active" boolean NOT NULL DEFAULT true
);
CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" ("slug");

CREATE TABLE "products" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "category_id" uuid REFERENCES "categories"("id"),
  "name" text NOT NULL,
  "slug" text NOT NULL,
  "brand" text,
  "description" text,
  "price_rwf" integer NOT NULL,
  "compare_at_rwf" integer,
  "sku" text NOT NULL,
  "image" text,
  "active" boolean NOT NULL DEFAULT true,
  "featured" boolean NOT NULL DEFAULT false,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX "products_slug_idx" ON "products" ("slug");
CREATE UNIQUE INDEX "products_sku_idx" ON "products" ("sku");

CREATE TABLE "product_images" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "product_id" uuid NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
  "url" text NOT NULL,
  "alt" text,
  "sort_order" integer NOT NULL DEFAULT 0
);

CREATE TABLE "inventory" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "product_id" uuid NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
  "quantity" integer NOT NULL DEFAULT 0,
  "low_stock_threshold" integer NOT NULL DEFAULT 5,
  "updated_at" timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX "inventory_product_idx" ON "inventory" ("product_id");

CREATE TABLE "addresses" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "label" text,
  "recipient_name" text NOT NULL,
  "phone" text NOT NULL,
  "district" text NOT NULL,
  "sector" text,
  "street" text,
  "notes" text
);

CREATE TABLE "orders" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "order_number" text NOT NULL,
  "user_id" uuid REFERENCES "users"("id"),
  "customer_name" text NOT NULL,
  "customer_phone" text NOT NULL,
  "customer_email" text,
  "delivery_district" text NOT NULL,
  "delivery_address" text NOT NULL,
  "subtotal_rwf" integer NOT NULL,
  "delivery_rwf" integer NOT NULL DEFAULT 0,
  "discount_rwf" integer NOT NULL DEFAULT 0,
  "total_rwf" integer NOT NULL,
  "status" "order_status" NOT NULL DEFAULT 'pending',
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX "orders_order_number_idx" ON "orders" ("order_number");

CREATE TABLE "order_items" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "order_id" uuid NOT NULL REFERENCES "orders"("id") ON DELETE CASCADE,
  "product_id" uuid REFERENCES "products"("id"),
  "product_name" text NOT NULL,
  "sku" text NOT NULL,
  "quantity" integer NOT NULL,
  "unit_price_rwf" integer NOT NULL,
  "line_total_rwf" integer NOT NULL
);

CREATE TABLE "payments" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "order_id" uuid NOT NULL REFERENCES "orders"("id") ON DELETE CASCADE,
  "method" "payment_method" NOT NULL,
  "provider_reference" text,
  "amount_rwf" integer NOT NULL,
  "status" "payment_status" NOT NULL DEFAULT 'pending',
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE "payment_events" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "payment_id" uuid REFERENCES "payments"("id") ON DELETE CASCADE,
  "provider" text NOT NULL,
  "event_type" text NOT NULL,
  "provider_event_id" text,
  "payload" text NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE "discount_codes" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "code" text NOT NULL,
  "percent_off" integer,
  "amount_off_rwf" integer,
  "active" boolean NOT NULL DEFAULT true,
  "expires_at" timestamptz
);
CREATE UNIQUE INDEX "discount_codes_code_idx" ON "discount_codes" ("code");

CREATE TABLE "delivery_zones" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" text NOT NULL,
  "fee_rwf" integer NOT NULL,
  "active" boolean NOT NULL DEFAULT true
);
