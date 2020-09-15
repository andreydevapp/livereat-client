import { Injectable } from '@angular/core';
import { Carrito } from '../classes/carrito';
import { Pedido } from '../classes/pedido';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  constructor() { }

  public carrito:any = [];

  public cantidadEnCarrito = 0;

  public total = 0;

  public negocioPedido:any = [];

  //nueva forma mas actualizada

//  {
//   idNegocio: string;
//   nombreNegocio: string;
//   imgUrlNegocio: string;
//   lon: number;
//   lat: number;
//   total: number;
//   pedidos:[{
//     idPlatillo: string;
//     imgUrlPlatillo: string;
//     nombrePlatillo: string;
//     precio: number;
//     cantidad: number;
//   }],
//    envio:[{}]
//  }
  

  agregarCarrito(pedido:Pedido){
    //valido si el negocio existe
    let negocio = this.carrito.filter(negocio => negocio.idNegocio === pedido.idNegocio);
    if (negocio.length === 0) {
      // se arma el payload
      this.crearNuevoPedido(pedido);
    }else{
      let negocio = this.carrito.filter(negocio => negocio.idNegocio === pedido.idNegocio);
      if (negocio.length > 0) {
        this.validarAumentarPedido(pedido);
      }else{
        this.crearNuevoPedido(pedido);
      }
      //se agrega el pedido
      
    }
    console.log(this.carrito.filter(negocio => negocio.idNegocio === pedido.idNegocio));
  }

  crearNuevoPedido(pedido:Pedido){
    let zonas:any = [];
    const zonasPedido:any = pedido.zonasDeEnvio;
    console.log(zonasPedido);
    for (const zona of zonasPedido) {
      const payload = {
        id:zona._id,
        lugar:zona.lugar,
        precio:zona.precio,
        check:false
      };
      zonas.push(payload);
    }
    const payload = {
      idNegocio: pedido.idNegocio,
      nombreNegocio: pedido.nombreNegocio,
      imgUrlNegocio: pedido.imgUrlNegocio,
      lon: pedido.lon,
      lat: pedido.lat,
      total: pedido.precio,
      pedidos:[{
        idPlatillo: pedido.idPlatillo,
        imgUrlPlatillo: pedido.imgUrlPlatillo,
        imgUrlPlatilloMin: pedido.imgUrlPlatilloMin,
        nombrePlatillo: pedido.nombrePlatillo,
        precio: pedido.precio,
        cantidad: pedido.cantidad
      }],
      zonasDeEnvio:zonas
    }
    this.carrito.push(payload);
    this.cantidadEnCarrito ++;
  }

  validarAumentarPedido(pedido:Pedido){

    console.log("entre a agregar pedido");

    let contNegocio = 0;
    let contPlatillo = 0;
    let pedidoAumentado = false;
    for (const negocio of this.carrito) {
      if (negocio.idNegocio === pedido.idNegocio) {
        for (const platillo of negocio.pedidos) {
          if (platillo.idPlatillo === pedido.idPlatillo) {
            this.carrito[contNegocio].pedidos[contPlatillo].cantidad += 1;
            this.carrito[contNegocio].total += pedido.precio;
            this.cantidadEnCarrito ++;
            pedidoAumentado = true;
            break;
          }
          contPlatillo ++;
        }
      }
      contNegocio ++;
    }

    if (!pedidoAumentado) {
      this.agregarPedido(pedido);
    }
  }

  agregarPedido(pedido:Pedido){
    const payload = {
      idPlatillo: pedido.idPlatillo,
      imgUrlPlatillo: pedido.imgUrlPlatillo,
      imgUrlPlatilloMin: pedido.imgUrlPlatillo,
      nombrePlatillo: pedido.nombrePlatillo,
      precio: pedido.precio,
      cantidad: pedido.cantidad
    }

    let i = 0
    for (const negocio of this.carrito) {
      if (negocio.idNegocio === pedido.idNegocio) {
        this.carrito[i].pedidos.push(payload);
        this.carrito[i].total += payload.precio;
        this.cantidadEnCarrito ++;
        break;
      }
      i++
    }
  }

  disminurPedido(idPlatillo,idNegocio ){
    let contNegocio = 0;
    let contPlatillo = 0;
    for (const negocio of this.carrito) {
      if (negocio.idNegocio === idNegocio) {
        for (const platillo of negocio.pedidos) {
          if (platillo.idPlatillo === idPlatillo) {
            this.carrito[contNegocio].pedidos[contPlatillo].cantidad -= 1;
            this.carrito[contNegocio].total -= this.carrito[contNegocio].pedidos[contPlatillo].precio;
            this.cantidadEnCarrito --;
            if (this.carrito[contNegocio].pedidos[contPlatillo].cantidad === 0) {
              this.eliminarPedido(idPlatillo,idNegocio);
            }
            break;
          }
          contPlatillo ++;
        }
      }
      contNegocio ++;
    }
    return {carrito:this.carrito, cantidadEnCarrito: this.cantidadEnCarrito};
  }

  aumentarPedido(idPlatillo,idNegocio ){
    let contNegocio = 0;
    let contPlatillo = 0;
    for (const negocio of this.carrito) {
      if (negocio.idNegocio === idNegocio) {
        for (const platillo of negocio.pedidos) {
          if (platillo.idPlatillo === idPlatillo) {
            this.carrito[contNegocio].pedidos[contPlatillo].cantidad += 1;
            this.carrito[contNegocio].total += this.carrito[contNegocio].pedidos[contPlatillo].precio;
            this.cantidadEnCarrito ++;
            break
          }
          contPlatillo ++;
        }
      }
      contNegocio ++;
    }
    console.log(this.carrito);
    return {carrito:this.carrito, cantidadEnCarrito: this.cantidadEnCarrito};
  }

  eliminarPedido(idPlatillo,idNegocio){
    let contNegocio = 0;
    for (const negocio of this.carrito) {
      if (negocio.idNegocio === idNegocio) {

        const platillo:any = this.carrito[contNegocio].pedidos.filter( platillo => platillo.idPlatillo === idPlatillo );
        console.log(platillo);
        console.log(platillo[0].precio)
        console.log(platillo[0].cantidad)
        this.carrito[contNegocio].total -= platillo[0].precio * platillo[0].cantidad;

        this.carrito[contNegocio].pedidos = this.carrito[contNegocio].pedidos.filter( platillo => platillo.idPlatillo !== idPlatillo );
        this.cantidadEnCarrito -= platillo[0].cantidad;

        console.log(this.carrito[contNegocio].pedidos.length);
        if (this.carrito[contNegocio].pedidos.length === 0) {
          this.carrito = this.carrito.filter( negocio => negocio.idNegocio !== idNegocio );
        }
      }
      contNegocio ++;
    }
    console.log(this.carrito);
    return {carrito:this.carrito, cantidadEnCarrito: this.cantidadEnCarrito};
  }

  valueCheck(idNegocio, idEnvio){
    let contNegocio = 0;
    let contZona = 0;
    for (const negocio of this.carrito) {
      if (negocio.idNegocio === idNegocio) {
        console.log("si encontre el negocio");
        for (const zona of negocio.zonasDeEnvio) {
          if (zona.id === idEnvio) {
            console.log("si encontre la zona");
            if (zona.check === true) {
              console.log(zona,this.carrito[contNegocio].zonasDeEnvio[contZona].check)
              this.carrito[contNegocio].zonasDeEnvio[contZona] = {
                id: zona.id,
                lugar: zona.lugar,
                precio: zona.precio,
                check: false
              };
              this.carrito[contNegocio].total -= zona.precio;
              console.log("carrito actualizado",this.carrito)
            }else{
              console.log(zona,this.carrito[contNegocio].zonasDeEnvio[contZona].check)
              this.carrito[contNegocio].zonasDeEnvio[contZona] = {
                id: zona.id,
                lugar: zona.lugar,
                precio: zona.precio,
                check: true
              };
              this.carrito[contNegocio].total += zona.precio;
              console.log("carrito actualizado",this.carrito)
            }
          }else{
            if (zona.check === true) {
              this.carrito[contNegocio].total -= zona.precio;
            }
            console.log(zona,this.carrito[contNegocio].zonasDeEnvio[contZona].check)
              this.carrito[contNegocio].zonasDeEnvio[contZona] = {
                id: zona.id,
                lugar: zona.lugar,
                precio: zona.precio,
                check: false
              };
              console.log("carrito actualizado",this.carrito)
          }
          contZona ++;
        }
        break;
      }
      contNegocio ++ ;
    }
    return this.carrito;
  }

}
