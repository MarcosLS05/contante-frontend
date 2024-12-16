import { ITipobalance } from "./tipobalance.interface";

export interface IBalance {
  id: number;
  titulo: string;
  descripcion: string;
  grupotipoasientos?: any;
  gruposubcuentas?: any;
  grupotipocuentas?: any;
  grupocuentas?: any;
  grupotipoapuntes?: any;
  tipobalance: ITipobalance;
}
