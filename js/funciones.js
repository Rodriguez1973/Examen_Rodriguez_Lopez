let intervaloTiempo //Tiempo en milisegundos de la tarea programada.
let tareaTemporizada //Tarea temporizada.
let iconosImagenes=[semaforoV,semaforoA,semaforoR] //Array con los iconos de las imágenes.
let indiceImagen=0;
let mediaTemperatura;

//--------------------------------------------------------------------------------------------------
//Referencias de la interfaz.
elementosUrbanos=document.getElementById("elementosUrbanos")
MensajeTemperatura=document.getElementById("MensajeTemperatura")
tipoIot=document.getElementById("tipoIot")
distanciaIot=document.getElementById("distanciaIot")
map_canvas=document.getElementById("map_canvas")
bgestionarTrafico=document.getElementById("bgestionarTrafico")
finGestionarTrafico=document.getElementById("finGestionarTrafico")
fdesde=document.getElementById("fdesde")
fhasta=document.getElementById("fhasta")


//--------------------------------------------------------------------------------------------------
//Eventos.
fdesde.addEventListener('change',()=>{
    borrarMarcadores()
    añadirMarcador(posicionOrigen, semaforoRAV)
    leerRegistrosPorTipo(tipoIot.value)
},false)

fhasta.addEventListener('change',()=>{
    borrarMarcadores()
    añadirMarcador(posicionOrigen, semaforoRAV)
    leerRegistrosPorTipo(tipoIot.value)
},false)

distanciaIot.addEventListener('change', (evento) => {
    let distancia=evento.target.value
    if (dispositivosIOT) {
      borrarMarcadores()
      añadirMarcador(posicionOrigen, semaforoRAV)
      leerRegistrosPorTipo(tipoIot.value)
    }
  },false)


elementosUrbanos.addEventListener('change',(evento)=>{
  finalizarTareaTemporizada()
  borrarMarcadores()
  //console.log(evento.target.value)
  añadirMarcador(convertirCadenaAPosicion(evento.target.value),semaforoRAV)
  centrarMapa(convertirCadenaAPosicion(evento.target.value))
})

//Click en gestionar tráfico
bgestionarTrafico.addEventListener('click',iniciarTareaTemporizada,false)

//Click en gestionar tráfico
finGestionarTrafico.addEventListener('click',finalizarTareaTemporizada,false)

//Cambio en tipo.
tipoIot.addEventListener('change', (evento) => {
    borrarMarcadores()
    añadirMarcador(posicionOrigen, semaforoRAV)
    leerRegistrosPorTipo(evento.target.value)
})

//--------------------------------------------------------------------------------------------------
//Iniciar tarea temporizada.
function iniciarTareaTemporizada() {
    establecerIntervaloTiempo()
    indiceImagen=0
    marcadores[0].setIcon(iconosImagenes[indiceImagen]) //Cambia el ícono del mapa.
    marcadores[0].setMap(mapa)  //Establece el ícono en el mapa.
  //Ejecuta la función repetidamente cada intervalo indicado en milisegundos.
  tareaTemporizada = setInterval(() => {
    cambiarImagen()
  }, intervaloTiempo)
}

//--------------------------------------------------------------------------------------------------
//Finalizar tarea temporizada.
function finalizarTareaTemporizada() {
  clearInterval(tareaTemporizada)
  marcadores[0].setIcon(semaforoRAV) //Cambia el ícono del mapa.
  marcadores[0].setMap(mapa)  //Establece el ícono en el mapa.
}

//--------------------------------------------------------------------------------------------------
//Cambiar la imagen.
function cambiarImagen(){
    indiceImagen++;
    if (indiceImagen >= iconosImagenes.length) {
        indiceImagen = 0;
    }
    marcadores[0].setIcon(iconosImagenes[indiceImagen]) //Cambia el ícono del mapa.
    marcadores[0].setMap(mapa)  //Establece el ícono en el mapa.
}

//Establece el intervalño
function establecerIntervaloTiempo(){
    if(mediaTemperatura!=NaN){
      if (mediaTemperatura > 32 ){
        intervaloTiempo=10000
      }else if (mediaTemperatura <=32 && mediaTemperatura> 25 ){
        intervaloTiempo=5000
      }else if (mediaTemperatura <= 25 ){
        intervaloTiempo=2000
      }
    }
  }

//--------------------------------------------------------------------------------------------------
//Validar las fechas de entrada y salida. Si las fechas no son números, la fecha desde es posterior a la de hasta y si la cadena que representa a una fecha tiene menos de 10 caracteres no es válida.
function validarFechas() {
    fechaInicio = fdesde.value
    fechaFin = fhasta.value
    if (fechaInicio.length === 10 && fechaFin.length === 10) {
        fechaInicio = fechaInicio.replaceAll('-', '')
        fechaFin = fechaFin.replaceAll('-', '')
        //Son dos números.
        if (!isNaN(fechaInicio) && !isNaN(fechaFin)) {
            //La fecha de inicio es inferior a la de fin. Fechas válidas.
            if (fechaInicio <= fechaFin) {
                return true
            }
        }
    }
    return false
}

//--------------------------------------------------------------------------------------------------
//Inicio de la aplicación.
leerRegistros('Semaforo')
//Lee los registros por el tipo.
leerRegistrosPorTipo(tipoIot.value)