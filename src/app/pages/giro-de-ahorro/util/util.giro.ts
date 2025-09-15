export class UtilGiro {

    constructor() {
        //requerido
    }

    /**
      * Encargado de validar si al menos un regimen del producto apv cuenta con saldo.
      * @param productos 
      * @param CONSTANTES_GIRO 
      * 
      * @returns 
      * true: Producto APV Cuenta Con saldo
      * false: Producto APV Cuenta Sin saldo
    */
    validarCuentaConSaldoAPVPensionado(productos:any,ID_PRODUCTO_APV:any): boolean {
        
        let productoAPV = productos.find((producto: any) => producto.idProducto === ID_PRODUCTO_APV);
        if(!productoAPV) { // Sin cuenta APV
            return false;
        }

        let listadoFondos = productoAPV.fondos;
        if(!listadoFondos) {// Sin fondos registrados ( caso de borde )
            return false;
        }

        for(let fondo of listadoFondos) {
            if(!fondo.regimenes) {
                continue;
            }
        
            /**
             * Buscamos dentro del listado de regimenes si existe uno con saldo mayor a '0' , de existir retornamos verdadero ya que indica que al menos un regimen cuenta con saldo.
             */
            let listadoRegimenesSinSaldo = fondo.regimenes.find((regimen: any) => regimen.saldoEnPesosEnLinea > 0 );
            if(listadoRegimenesSinSaldo) {
                return true;
            }
        }
        return false;
    }
}
