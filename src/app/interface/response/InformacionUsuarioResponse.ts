export interface InformacionUsuarioResponse {
    usuario: string;
    nombreUsuario: string;
    correo: string;
    entidad: number;
    usuarioInterno: boolean;
    tipoUsuario: number;
    esSecretario: boolean;
    esArbitro: boolean;
    esUsuarioParte: boolean;
    esAdministrativo: boolean;
    intIdtUsuario_Antiguo: number;
    certificadoCargado: boolean;
    contraseniaCertificadoCargada: boolean;
  }
  