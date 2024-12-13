export interface Firma {
    id: number;
    nroCaso: string;
    tipoFirma: string;
    tipoDocumento: string;
    estado:number;
    fechaSolicitud: Date;
    fechaFirma?: Date;
  }