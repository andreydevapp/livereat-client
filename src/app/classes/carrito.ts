export class Carrito {

    public idNegocio: string;
    public nombreNegocio: string;
    public imgUrlNegocio: string;

    public idPlatillo: string;
    public imgUrlPlatillo: string;
    public nombrePlatillo: string;
    public precio: number;
    public lon: number;
    public lat: number;

    public cantidad: number;

    constructor( idNegocio: string, nombreNegocio: string, imgUrlNegocio: string, idPlatillo: string, imgUrlPlatillo: string, nombrePlatillo: string, precio: number,cantidad: number, lon:number, lat:number) {

        this.idNegocio = idNegocio;
        this.nombreNegocio = nombreNegocio;
        this.imgUrlNegocio = imgUrlNegocio;
        this.idPlatillo = idPlatillo;
        this.imgUrlPlatillo = imgUrlPlatillo;
        this.nombrePlatillo = nombrePlatillo;
        this.precio = precio;
        this.cantidad = cantidad;
        this.lon = lon;
        this.lat = lat;
    }
}