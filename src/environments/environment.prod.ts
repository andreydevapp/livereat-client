export const environment = {
  production: true,
  wsUrl: 'http://localhost:5000/',
  URI:'http://localhost:5000/'
};

export const cliente = {
  //rutas para metodos crud
  registrarse:'cliente/registrar_usuario',
  loguearse:'cliente/iniciar_sesion',
  loguearsePorToken:'cliente/iniciar_sesion_por_token',
  protected:'protected'
};

export const http_platillo = {
  //rutas para metodos crud
  obtener: 'cliente/get_platillos/'
};

export const http_pedidos = {
  //rutas para las notificacione push
  nuevo_pedido:'cliente/nuevo_pedido',
  obtener_pedido:'cliente/obtener_pedido'
};

export const http_chat_method = {

  obtenerChats:"chat/get_chat",
  obtenerMensajes:"chat/get_mensajes",
  modificarEstadoChat:"cliente/modificar_estado_chat",
  modificarMensajesSinVer:"chat/modificar-mensajes-sin-ver"

}

export const notificaciones = {
  //rutas para las notificacione push
  OneSignalAppid:'de9fdc52-8fbf-44db-8aae-8fe1ead04310',
  RestApiKey:'MDg3ZTU2MDMtNjAxOS00YTdmLTkwOTAtZDBlN2IzN2YwNTVl'
};

export const configFirebase = {
  apiKey: "AIzaSyA9OQfjf9EwKnE6edYzF019sjiX5bdpo_I",
  authDomain: "livereat-70bde.firebaseapp.com",
  databaseURL: "https://livereat-70bde.firebaseio.com",
  projectId: "livereat-70bde",
  storageBucket: "livereat-70bde.appspot.com",
  messagingSenderId: "347630441127",
  appId: "1:347630441127:web:9b4d607384aab10bd2c182"
}