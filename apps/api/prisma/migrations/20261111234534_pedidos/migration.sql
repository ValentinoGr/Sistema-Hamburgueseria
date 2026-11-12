-- CreateTable
CREATE TABLE "Pedido" (
    "id" SERIAL NOT NULL,
    "fecha" DATE NOT NULL,
    "numero" INTEGER NOT NULL,
    "tokenSeguimiento" UUID NOT NULL,
    "origen" "OrigenPedido" NOT NULL DEFAULT 'WEB',
    "clienteNombre" TEXT NOT NULL,
    "clienteTelefono" TEXT NOT NULL,
    "tipoEntrega" "TipoEntrega" NOT NULL,
    "zonaEnvioId" INTEGER,
    "direccion" TEXT,
    "medioPago" "MedioPago" NOT NULL,
    "estadoPago" "EstadoPago" NOT NULL DEFAULT 'PENDIENTE',
    "pagoConfirmadoPorId" INTEGER,
    "pagoConfirmadoEn" TIMESTAMP(3),
    "estado" "EstadoPedido" NOT NULL DEFAULT 'NUEVO',
    "motivoCancelacion" "MotivoCancelacion",
    "detalleCancelacion" TEXT,
    "subtotal" INTEGER NOT NULL,
    "costoEnvio" INTEGER NOT NULL DEFAULT 0,
    "total" INTEGER NOT NULL,
    "facturado" BOOLEAN NOT NULL DEFAULT false,
    "tipoComprobante" TEXT,
    "nroComprobante" TEXT,
    "cae" TEXT,
    "docCliente" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PedidoItem" (
    "id" SERIAL NOT NULL,
    "pedidoId" INTEGER NOT NULL,
    "productoId" INTEGER,
    "nombreProducto" TEXT NOT NULL,
    "tamanoNombre" TEXT,
    "precioUnitario" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "nota" TEXT,

    CONSTRAINT "PedidoItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PedidoItemExtra" (
    "id" SERIAL NOT NULL,
    "pedidoItemId" INTEGER NOT NULL,
    "nombreExtra" TEXT NOT NULL,
    "precio" INTEGER NOT NULL,

    CONSTRAINT "PedidoItemExtra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PedidoItemSinIngrediente" (
    "id" SERIAL NOT NULL,
    "pedidoItemId" INTEGER NOT NULL,
    "nombreIngrediente" TEXT NOT NULL,

    CONSTRAINT "PedidoItemSinIngrediente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PedidoCambioEstado" (
    "id" SERIAL NOT NULL,
    "pedidoId" INTEGER NOT NULL,
    "estadoAnterior" "EstadoPedido",
    "estadoNuevo" "EstadoPedido" NOT NULL,
    "usuarioId" INTEGER,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PedidoCambioEstado_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pedido_tokenSeguimiento_key" ON "Pedido"("tokenSeguimiento");

-- CreateIndex
CREATE INDEX "Pedido_fecha_estado_idx" ON "Pedido"("fecha", "estado");

-- CreateIndex
CREATE INDEX "Pedido_estado_idx" ON "Pedido"("estado");

-- CreateIndex
CREATE UNIQUE INDEX "Pedido_fecha_numero_key" ON "Pedido"("fecha", "numero");

-- CreateIndex
CREATE INDEX "PedidoItem_pedidoId_idx" ON "PedidoItem"("pedidoId");

-- CreateIndex
CREATE INDEX "PedidoItem_productoId_idx" ON "PedidoItem"("productoId");

-- CreateIndex
CREATE INDEX "PedidoItemExtra_pedidoItemId_idx" ON "PedidoItemExtra"("pedidoItemId");

-- CreateIndex
CREATE INDEX "PedidoItemSinIngrediente_pedidoItemId_idx" ON "PedidoItemSinIngrediente"("pedidoItemId");

-- CreateIndex
CREATE INDEX "PedidoCambioEstado_pedidoId_idx" ON "PedidoCambioEstado"("pedidoId");

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_zonaEnvioId_fkey" FOREIGN KEY ("zonaEnvioId") REFERENCES "ZonaEnvio"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_pagoConfirmadoPorId_fkey" FOREIGN KEY ("pagoConfirmadoPorId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PedidoItem" ADD CONSTRAINT "PedidoItem_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Pedido"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PedidoItem" ADD CONSTRAINT "PedidoItem_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PedidoItemExtra" ADD CONSTRAINT "PedidoItemExtra_pedidoItemId_fkey" FOREIGN KEY ("pedidoItemId") REFERENCES "PedidoItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PedidoItemSinIngrediente" ADD CONSTRAINT "PedidoItemSinIngrediente_pedidoItemId_fkey" FOREIGN KEY ("pedidoItemId") REFERENCES "PedidoItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PedidoCambioEstado" ADD CONSTRAINT "PedidoCambioEstado_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Pedido"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PedidoCambioEstado" ADD CONSTRAINT "PedidoCambioEstado_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
