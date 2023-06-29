var queryString = window.location.search;
var urlParametros = new URLSearchParams(queryString);
var id_trabajador_contacto_url = urlParametros.get('id');

// Listar Datos Laborales
function listarDatosLaborales() {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    fetch("http://localhost:3000/api/datos_laborales", requestOptions)
        .then(response => response.json())
        .then((json) => {
            json.forEach(completarFila);
            return json;
        })
        .then((json) => {
            $("#tbl_datos_laborales").DataTable();
        })
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}

//Completar fila datos laborales
function completarFila(element, index, arr) {
    if (element.rut_trabajador === id_trabajador_contacto_url) {
        arr[index] = document.querySelector('#tbl_datos_laborales tbody').innerHTML +=
            `<tr>
          <td>${element.rut_trabajador}</td>
          <td>${element.cargo_trabajador}</td>
          <td>${formatDate(element.fecha_ingreso)}</td>
          <td>${element.area_trabajador}</td>
          <td>${element.departamento_trabajador}</td>
          <td>
    <a href='eliminar-datos-laborales.html?iddatos=${element.id_datos_laborales}&idtrab=${element.rut_trabajador}'> <img src='../img/eliminar_24x24.png'></a> 
    <a href='actualizar-datos-laborales.html?iddato=${element.id_datos_laborales}&idtrab=${element.rut_trabajador}'> <img src='../img/actualizar_24x24.png'></a> 
    </td>
  
      </tr>`
    }
}

//Agregar Datos Laborales
function crearDatosLaborales() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    //Variables con los datos de formulario para agreagar datos laborales

    var txt_cargo = document.getElementById("lista-cargo-trabajo").value;
    var fecha_ingreso = document.getElementById("txt_fecha_ingreso").value;
    var seleccion_area = document.getElementById("lista-area-trabajo").value;
    var seleccion_departamento = document.getElementById("lista-departamentos-trabajo").value;

    var raw = JSON.stringify({
        "id_datos_laborales": null,
        "rut_trabajador": id_trabajador_contacto_url,
        "cargo_trabajador": txt_cargo,
        "fecha_ingreso": fecha_ingreso,
        "area_trabajador": seleccion_area,
        "departamento_trabajador": seleccion_departamento
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("http://localhost:3000/api/datos_laborales", requestOptions)
        .then(response => {
            if (response.ok) {
                alert("Datos laborales agregados agregado");
                location.reload();
            }
        })
}

//ACTUALIZACIÓN DE DATOS LABORALES ________________________________________________________________________________________________________________________

function formatDate(date) {
    const fecha = new Date(date);

    const day = fecha.getDate() < 10 ? `0${fecha.getDate()}` : fecha.getDate();
    const month = fecha.getMonth() < 10 ? `0${fecha.getMonth() + 1}` : fecha.getMonth() + 1;

    return `${day}-${month}-${fecha.getFullYear()}`;
}

function formatDate2(date) {
    const fecha = new Date(date);

    const day = fecha.getDate() < 10 ? `0${fecha.getDate()}` : fecha.getDate();
    const month = fecha.getMonth() < 10 ? `0${fecha.getMonth() + 1}` : fecha.getMonth() + 1;

    return `${fecha.getFullYear()}-${month}-${day}`;
}
// Consultar datos laborales
function consultarDatosLaborales(id_datos_laborales) {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    fetch("http://localhost:3000/api/datos_laborales/" + id_datos_laborales, requestOptions)
        .then(response => response.json())
        .then((json) => json.forEach(completarFormulario))
        .catch(error => console.log('error', error));
}
//Completar formulario 
function completarFormulario(element) {
    var txt_cargo = element.cargo_trabajador;
    var fecha_ingreso = formatDate2(element.fecha_ingreso);
    var seleccion_area = element.area_trabajador;
    var seleccion_departamento = element.departamento_trabajador;

    document.getElementById("lista-cargo-trabajo").value = txt_cargo;
    document.getElementById("txt_fecha_ingreso").value = fecha_ingreso;
    document.getElementById("lista-area-trabajo").value = seleccion_area;
    document.getElementById("lista-departamentos-trabajo").value = seleccion_departamento;

}

//Obtenemos los datos de la carga familiar a actualizar
function obtenerIDDatosActualizar() {
    var queryString = window.location.search;
    var urlParametros = new URLSearchParams(queryString);
    var id_datos_url = urlParametros.get('iddato');

    consultarDatosLaborales(id_datos_url);
}
// Actualizamos los datos laborales con el método patch
function actualizarDatosLaborales() {

    var queryString = window.location.search;
    var urlParametros = new URLSearchParams(queryString);
    var id_trabajador_contacto_url = urlParametros.get('idtrab');
    var id_dato_laboral_url = urlParametros.get('iddato');

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var id_datos_laborales = id_dato_laboral_url;
    var txt_cargo = document.getElementById("lista-cargo-trabajo").value;
    var fecha_ingreso = document.getElementById("txt_fecha_ingreso").value;
    var seleccion_area = document.getElementById("lista-area-trabajo").value;
    var seleccion_departamento = document.getElementById("lista-departamentos-trabajo").value;

    var raw = JSON.stringify({
        "id_datos_laborales": id_datos_laborales,
        "rut_trabajador": id_trabajador_contacto_url,
        "cargo_trabajador": txt_cargo,
        "fecha_ingreso": fecha_ingreso,
        "area_trabajador": seleccion_area,
        "departamento_trabajador": seleccion_departamento

    });

    var requestOptions = {
        method: 'PATCH',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("http://localhost:3000/api/datos_laborales/" + id_datos_laborales, requestOptions)
        .then(response => {
            if (response.ok) {
                alert("Contacto de emergencia actualizado");
                window.location.href = "listar-datos-laborales.html?id=" + id_trabajador_contacto_url;
            }

        })
}

//ELIMINAR DATOS LABORALES_________________________________________________________________________________________________________________________
//Obtenemos id del contacto de emergencia a eliminar
function obtenerIDDatosEliminar() {
    //Mostramos mensaje de confirmación
    var mensaje = "¿Desea eliminar los datos laborales?";
    document.getElementById("alt_eliminacion").innerHTML = mensaje;
}
// Eliminar contacto de emergencia
function eliminarDatosLaborales() {
    var queryString = window.location.search;
    var urlParametros = new URLSearchParams(queryString);
    var id_dato_url = urlParametros.get('iddatos');
    var id_trabajador_contacto_url = urlParametros.get('idtrab');

    var requestOptions = {
        method: 'DELETE',
        redirect: 'follow'
    };

    fetch("http://localhost:3000/api/datos_laborales/" + id_dato_url, requestOptions)
        .then(response => {
            if (response.ok) {
                alert("Datos eliminados");
                window.location.href = "listar-datos-laborales.html?id=" + id_trabajador_contacto_url;
            } else {
                alert("No puede eliminar los datos laborales.")
            }

        })
}

