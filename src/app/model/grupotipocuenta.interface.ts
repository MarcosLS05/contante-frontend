import { IBalance } from "./balance.interface"
import { ITipocuenta } from "./tipocuenta.interface"

export interface IGrupotipocuenta {
    id: number 
    titulo: string
    descripcion: string
    orden: number
    tipocuenta: ITipocuenta
    balance: IBalance
  }