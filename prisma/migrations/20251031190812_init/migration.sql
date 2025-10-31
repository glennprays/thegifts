-- CreateTable
CREATE TABLE "AssessmentResult" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "answer" JSONB NOT NULL,
    "result" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssessmentResult_pkey" PRIMARY KEY ("id")
);
