-- Initial production-grade schema with normalization and referential integrity.

CREATE TYPE "Difficulty" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');
CREATE TYPE "RegistrationStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED');
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'SETTLED', 'FAILED', 'REFUNDED');

CREATE TABLE "User" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "firstName" VARCHAR(60) NOT NULL,
  "lastName" VARCHAR(60) NOT NULL,
  "email" VARCHAR(255) UNIQUE,
  "phone" VARCHAR(32) UNIQUE NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE "Event" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "title" VARCHAR(120) NOT NULL,
  "description" TEXT NOT NULL,
  "location" VARCHAR(120) NOT NULL,
  "startDate" TIMESTAMPTZ NOT NULL,
  "endDate" TIMESTAMPTZ NOT NULL,
  "difficulty" "Difficulty" NOT NULL,
  "capacity" INTEGER NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE "Payment" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "amount" INTEGER NOT NULL,
  "currency" VARCHAR(8) NOT NULL,
  "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
  "providerReference" VARCHAR(128) NOT NULL,
  "ledgerId" VARCHAR(128) UNIQUE NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE "Registration" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL REFERENCES "User" ("id") ON DELETE CASCADE,
  "eventId" UUID NOT NULL REFERENCES "Event" ("id") ON DELETE CASCADE,
  "status" "RegistrationStatus" NOT NULL DEFAULT 'PENDING',
  "paymentId" UUID REFERENCES "Payment" ("id") ON DELETE SET NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE "Payment"
  ADD CONSTRAINT "Payment_registration_fkey"
  FOREIGN KEY ("id") REFERENCES "Registration" ("paymentId") DEFERRABLE INITIALLY DEFERRED;

CREATE TABLE "AuditLog" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "actorId" UUID REFERENCES "User" ("id"),
  "actorType" VARCHAR(64) NOT NULL,
  "entityId" UUID NOT NULL,
  "entityType" VARCHAR(64) NOT NULL,
  "action" VARCHAR(64) NOT NULL,
  "payload" JSONB NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX "idx_registration_user" ON "Registration" ("userId");
CREATE INDEX "idx_registration_event" ON "Registration" ("eventId");
CREATE INDEX "idx_event_dates" ON "Event" ("startDate", "endDate");
CREATE INDEX "idx_auditlog_entity" ON "AuditLog" ("entityType", "entityId");

