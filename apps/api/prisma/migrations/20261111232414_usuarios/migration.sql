-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('ADMIN', 'COCINA', 'CAJA');

-- CreateEnum
CREATE TYPE "EstadoPedido" AS ENUM ('NUEVO', 'EN_PREPARACION', 'LISTO', 'EN_CAMINO', 'ENTREGADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "TipoEntrega" AS ENUM ('DELIVERY', 'RETIRO');

-- CreateEnum
CREATE TYPE "MedioPago" AS ENUM ('TRANSFERENCIA', 'EFECTIVO', 'MERCADO_PAGO');

-- CreateEnum
CREATE TYPE "EstadoPago" AS ENUM ('PENDIENTE', 'CONFIRMADO', 'RECHAZADO');

-- CreateEnum
CREATE TYPE "OrigenPedido" AS ENUM ('WEB', 'CAJA');

-- CreateEnum
CREATE TYPE "MotivoCancelacion" AS ENUM ('CLIENTE_DESISTIO', 'SIN_STOCK', 'PAGO_NO_RECIBIDO', 'OTRO');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "rol" "Rol" NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");
