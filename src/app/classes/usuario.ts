export class Usuario {

    public nombre: string;
    public id: string;
    public idWS:string;
    public token: string;
    public imagen: string;
    public email: string;
    public logueadoConFb:boolean;
    public opc:string;

    constructor( nombre: string, id: string, token: string, imagen: string, email: string) {
        
        this.nombre = nombre;
        this.id = id;
        this.idWS = 'sin-id';
        this.token = token;
        this.imagen = imagen;
        this.email = email;
        this.logueadoConFb = false;
        this.opc = 'cliente';
    }



}

