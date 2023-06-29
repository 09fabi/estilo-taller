//Crear trabajador
function crearTrabajador() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    //Variables con los datos de formulario para crear trabajador
    var txt_id_trabajador = document.getElementById("txt_id_trabajador").value;
    var txt_nombre = document.getElementById("txt_nombre").value;
    var seleccion_sexo = document.getElementById("lista-sexo").value;
    var txt_fecha_nacimiento = document.getElementById("txt_fecha_nacimiento").value;
    var txt_direccion = document.getElementById("txt_direccion").value;
    var txt_telefono = document.getElementById("txt_telefono").value;

    var raw = JSON.stringify({
        "rut": txt_id_trabajador,
        "nombre": txt_nombre,
        "sexo": seleccion_sexo,
        "fecha_nacimiento": txt_fecha_nacimiento,
        "direccion": txt_direccion,
        "telefono": txt_telefono

    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("http://localhost:3000/api/trabajador", requestOptions)
        .then(response => {
            if (response.ok) {
                alert("trabajador agregado");
                window.location.href = "listar-trabajadores.html";
            }
        })
}
// Lista de trabajadores
function listarTrabajadores() {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    fetch("http://localhost:3000/api/trabajador?_size=100", requestOptions)
        .then(response => response.json())
        .then((json) => {
            json.forEach(completarFila);
            return json;

        })
        .then((json) => {
            $("#tbl_trabajadores").DataTable();
        })
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}

//Completar fila
function completarFila(element, index, arr) {
    arr[index] = document.querySelector('#tbl_trabajadores tbody').innerHTML +=
        `<tr>
          <td>${element.rut}</td>
          <td>${element.nombre}</td>
          <td>${element.sexo}</td>
          <td>${formatDate(element.fecha_nacimiento)}</td>
          <td>${element.direccion}</td>
          <td>${element.telefono}</td>
          <td> <a href='eliminar-trabajador.html?id=${element.rut}&nombre=${element.nombre}'>   <img alt='Eliminar trabajador' width=40 height=40 src='../img/eliminar_24x24.png'></a> </td>
    <td> <a href='actualizar-trabajador.html?id=${element.rut}'> <img src='../img/actualizar_24x24.png'></a> </td>
    <td><a href='../datos-laborales/listar-datos-laborales.html?id=${element.rut}'> <img alt='Datos laborales' width=50 height=50  src='../img/resultados_640x640.png'></a> </td>
    <td><a href='../contacto-emergencia/listar-contacto-emergencia.html?id=${element.rut}'> <img src='../img/emergencia_48x48.png'></a></td>
    <td><a href='../carga-familiar/listar-carga-familiar.html?id=${element.rut}'> <img src='../img/carga_familiar_48x48.png'></a> </td>
    </td>
      </tr>`
}

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
// Consultar datos del trabajador
function consultarDatostrabajador(id_trabajador) {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    fetch("http://localhost:3000/api/trabajador/" + id_trabajador, requestOptions)
        .then(response => response.json())
        .then((json) => json.forEach(completarFormulario))
        .catch(error => console.log('error', error));
}
//Completar formulario
function completarFormulario(element) {
    var id_trabajador = element.rut;
    var nombre = element.nombre;
    var sexo = element.sexo;
    var fecha_nacimiento = formatDate2(element.fecha_nacimiento);
    var direccion = element.direccion;
    var telefono = element.telefono;

    document.getElementById("txt_id_trabajador").value = id_trabajador;
    document.getElementById("txt_nombre").value = nombre;
    document.getElementById("lista-sexo").value = sexo;
    document.getElementById("txt_fecha_nacimiento").value = fecha_nacimiento;
    document.getElementById("txt_direccion").value = direccion;
    document.getElementById("txt_telefono").value = telefono;

}

//Obtenemos los datos del trabajador a actualizar
function obtenerIDtrabajadorActualizar() {
    var queryString = window.location.search;
    var urlParametros = new URLSearchParams(queryString);
    var id_trabajador_url = urlParametros.get('id');

    document.getElementById("txt_id_trabajador").value = id_trabajador_url;
    consultarDatostrabajador(id_trabajador_url);

}
// Actualizamos los datos del trabajador con el método patch
function actualizarTrabajador() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var txt_id_trabajador = document.getElementById("txt_id_trabajador").value;
    var txt_nombre = document.getElementById("txt_nombre").value;
    var txt_sexo = document.getElementById("lista-sexo").value;
    var txt_fecha_nacimiento = document.getElementById("txt_fecha_nacimiento").value;
    var txt_direccion = document.getElementById("txt_direccion").value;
    var txt_telefono = document.getElementById("txt_telefono").value;

    var raw = JSON.stringify({
        "rut": txt_id_trabajador,
        "nombre": txt_nombre,
        "sexo": txt_sexo,
        "fecha_nacimiento": txt_fecha_nacimiento,
        "direccion": txt_direccion,
        "telefono": txt_telefono

    });

    var requestOptions = {
        method: 'PATCH',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("http://localhost:3000/api/trabajador/" + txt_id_trabajador, requestOptions)
        .then(response => {
            if (response.ok) {
                alert("trabajador actualizado");
                window.location.href = "listar-trabajadores.html";
            }

        })
}

//Obtenemos id del trabajador a eliminar
function obtenerIDTrabajadorEliminar() {
    //Utilizamos search para acceder a las variables recibidas mediante URL
    var queryString = window.location.search;
    //Extraemos los parámetros
    var urlParametros = new URLSearchParams(queryString);
    //Creamos variable con el id del trabajador
    var id_trabajador_url = urlParametros.get('id');
    var nombre_url = urlParametros.get('nombre');

    //Agregamos ID a campo oculto
    document.getElementById('hdn_id_trabajador').value = id_trabajador_url;
    //Mostramos mensaje de confirmación
    var mensaje = "¿" + "Desea eliminar al trabajador " + nombre_url + "?";
    document.getElementById("alt_eliminacion").innerHTML = mensaje;
}
// Eliminar trabajador
function eliminarTrabajador() {
    //Obtenemos id a eliminar
    var id_trabajador_eliminar = document.getElementById('hdn_id_trabajador').value;

    var requestOptions = {
        method: 'DELETE',
        redirect: 'follow'
    };

    fetch("http://localhost:3000/api/trabajador/" + id_trabajador_eliminar, requestOptions)
        .then(response => {
            if (response.ok) {
                alert("trabajador eliminado");
            } else {
                alert("trabajador no puede ser eliminado. El registro está siendo utilizado")
            }
            window.location.href = "listar-trabajadores.html";

        })
}

