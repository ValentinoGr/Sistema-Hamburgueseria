-- CreateTable
CREATE TABLE "ZonaEnvio" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "costo" INTEGER NOT NULL,
    "activa" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ZonaEnvio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConfiguracionLocal" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "nombreLocal" TEXT NOT NULL,
    "telefono" TEXT,
    "aliasTransferencia" TEXT,
    "cbu" TEXT,
    "minutosAlerta" INTEGER NOT NULL DEFAULT 20,
    "horaCorteDia" TEXT NOT NULL DEFAULT '06:00',
    "pedidosPausados" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ConfiguracionLocal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HorarioAtencion" (
    "id" SERIAL NOT NULL,
    "configuracionId" INTEGER NOT NULL,
    "diaSemana" INTEGER NOT NULL,
    "abre" TEXT NOT NULL,
    "cierra" TEXT NOT NULL,

    CONSTRAINT "HorarioAtencion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ZonaEnvio_nombre_key" ON "ZonaEnvio"("nombre");

-- CreateIndex
CREATE INDEX "HorarioAtencion_configuracionId_diaSemana_idx" ON "HorarioAtencion"("configuracionId", "diaSemana");

-- AddForeignKey
ALTER TABLE "HorarioAtencion" ADD CONSTRAINT "HorarioAtencion_configuracionId_fkey" FOREIGN KEY ("configuracionId") REFERENCES "ConfiguracionLocal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
