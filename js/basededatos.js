/*
Proyecto realizado por: José A. Rodríguez López
Fecha: 10/12/2022
*/

//--------------------------------------------------------------------------------------------------
//Solicita los registros a la base de datos.
async function leerRegistros(datosRequeridos) {
  //Proporciona una forma fácil de obtener información de una URL sin tener que recargar la página completa. XMLHttpRequest es ampliamente usado en la programación AJAX.
  //A pesar de su nombre, XMLHttpRequest puede ser usado para recibir cualquier tipo de dato, no solo XML, y admite otros formatos además de HTTP (incluyendo file y ftp).
  var ajaxrequest = new XMLHttpRequest()

  //Aquí va la ruta al archivo php que realiza la consulta a la base de datos.
  ajaxrequest.open(
    'POST',
    'http://www.informaticasc2.com/CiudadI/php/consultaElementosUrbanos.php',
    true,
  )

  ajaxrequest.onreadystatechange = async function () {
    //alert(ajaxrequest.readyState + "--" + ajaxrequest.status);
    if (ajaxrequest.readyState === 4 && ajaxrequest.status === 200) {
      let datosLeidos = ajaxrequest.response
      console.log(datosLeidos)
      if (datosLeidos != 'null') {
        mostrarRegistro(JSON.parse(datosLeidos))
      } else {
        dispositivosIOT = null
        alert('No hay registros que cumplan la condición')
      }
    }
  }

  let envio = "Envio=" + datosRequeridos
  ajaxrequest.setRequestHeader(
    'Content-type',
    'application/x-www-form-urlencoded',
  )
  ajaxrequest.send(envio)
}

//--------------------------------------------------------------------------------------------------
//Muestra registro de la interfaz.
function mostrarRegistro(datosLeidos) {
  for (i = 0; i < datosLeidos.length; i++) {
    let opcion = document.createElement('option')
    opcion.value = datosLeidos[i].latitud + ',' + datosLeidos[i].longitud
    opcion.text = datosLeidos[i].nombre
    // Añade a la select <select id=”elementos”></select> la option creada
    document.getElementById('elementosUrbanos').appendChild(opcion)
  }
  //Crea la primera posición de origen con los datos del primer registro leído
  posicionOrigen = crearPosicion(
    datosLeidos[0].latitud,
    datosLeidos[0].longitud,
  )
  //Centra el mapa en la posición de origen.
  centrarMapa(posicionOrigen)
  //Añadir marcador
  añadirMarcador(posicionOrigen, semaforoRAV)
}

//--------------------------------------------------------------------------------------------------
//Solicita los registros a la base de datos por tipo.
async function leerRegistrosPorTipo(tipo) {
  //Proporciona una forma fácil de obtener información de una URL sin tener que recargar la página completa. XMLHttpRequest es ampliamente usado en la programación AJAX.
  //A pesar de su nombre, XMLHttpRequest puede ser usado para recibir cualquier tipo de dato, no solo XML, y admite otros formatos además de HTTP (incluyendo file y ftp).
  var ajaxrequest = new XMLHttpRequest()

  //Aquí va la ruta al archivo php que realiza la consulta a la base de datos.
  ajaxrequest.open('POST', 'http://www.informaticasc2.com/CiudadI/php/consultaDispositivosIot.php', true)

  ajaxrequest.onreadystatechange = async function () {
    //alert(ajaxrequest.readyState + "--" + ajaxrequest.status);
    if (ajaxrequest.readyState === 4 && ajaxrequest.status === 200) {
      let datosLeidos = ajaxrequest.response
      console.log(datosLeidos)
      if (datosLeidos != 'null') {
        dispositivosIOT = JSON.parse(datosLeidos)
        procesarDispositivosIOT(dispositivosIOT)
      } else {
        dispositivosIOT = null
        alert('No hay registros que cumplan la condición')
      }
    }
  }

  let envio = "Envio=" + tipo
  console.log(envio)
  ajaxrequest.setRequestHeader(
    'Content-type',
    'application/x-www-form-urlencoded',
  )
  ajaxrequest.send(envio)
}

//--------------------------------------------------------------------------------------------------
//Procesa los datos de los registros leídosdispositivos IOT.
function procesarDispositivosIOT(registros) {
  if (registros) {
    if (validarFechas()) {
      for (let i = 0; i < registros.length; i++) {
        let posicionDispositivo = crearPosicion(
          registros[i].Latitud,
          registros[i].Longitud,
        )
        //console.log( fdesde.value)
        //console.log( fhasta.value)

        if (
          distanciaEntre2Puntos(posicionOrigen, posicionDispositivo) <
          distanciaIot.value && registros[i].Fecha.replaceAll('-', '') >= fdesde.value.replaceAll('-', '') && registros[i].Fecha.replaceAll('-', '') <= fhasta.value.replaceAll('-', '' && fhasta.value!=NaN && fdesde.value!=NaN)
        ) {
          añadirMarcador(posicionDispositivo, iconoIOT)
        }
      }
      calcularMedia()
    }
  }
}

//Calcular la media.
function calcularMedia() {
  if (dispositivosIOT) {
    let sumaTemperaturas = 0
    let numElementos = 0
    for (let i = 0; i < dispositivosIOT.length; i++) {
      let posicionDispositivo = crearPosicion(
        dispositivosIOT[i].Latitud,
        dispositivosIOT[i].Longitud,
      )

      if (
        distanciaEntre2Puntos(posicionOrigen, posicionDispositivo) <
        distanciaIot.value
      ) {
        sumaTemperaturas = sumaTemperaturas + parseFloat(dispositivosIOT[i].UltimaMedicion)
        numElementos++;
      }
    }
    mediaTemperatura = sumaTemperaturas / numElementos
    MensajeTemperatura.innerText = "Temperatura:" + Math.round(mediaTemperatura * 100) / 100 + "ºC"
  }
}