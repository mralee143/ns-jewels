-- Drop profile image column (OAuth payloads are stripped in code; no avatar URLs stored).
ALTER TABLE "User" DROP COLUMN IF EXISTS "image";

-- Existing accounts keep access; new email/password signups require OTP before login.
UPDATE "User" SET "emailVerified" = NOW() WHERE "emailVerified" IS NULL;
