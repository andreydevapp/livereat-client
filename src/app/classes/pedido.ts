export interface Pedido {

    idNegocio: String,
    nombreNegocio: String,
    imgUrlNegocio: String,
    idPlatillo: String,
    imgUrlPlatillo: String, 
    imgUrlPlatilloMin: String, 
    nombrePlatillo: String,
    precio:Number,
    cantidad:Number,
    lon:Number,
    lat:Number,
    zonasDeEnvio:[]

}