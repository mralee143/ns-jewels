-- Saved shipping on user profile; optional link from order when checkout matches logged-in user.
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "shippingFullName" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "shippingPhone" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "shippingCountry" TEXT DEFAULT 'Pakistan';
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "shippingAddressLine1" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "shippingCity" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "shippingPostalCode" TEXT;

ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "userId" TEXT;

CREATE INDEX IF NOT EXISTS "Order_userId_idx" ON "Order"("userId");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Order_userId_fkey'
  ) THEN
    ALTER TABLE "Order"
      ADD CONSTRAINT "Order_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
