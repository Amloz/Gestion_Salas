document.addEventListener('DOMContentLoaded', () => {
  const tablaSalas = document.getElementById('tablaSalas');
  const salaReserva = document.getElementById('salaReserva'); // Corrección
  const listaReservas = document.getElementById('listaReservas');
  const salaForm = document.getElementById('salaForm');
  const reservaForm = document.getElementById('reservaForm');

  // Función para actualizar la lista de salas (tabla y desplegable)
  function actualizarSalas() {
    fetch('http://localhost:3000/salas')
      .then(response => response.json())
      .then(salas => {
        tablaSalas.innerHTML = '';
        salaReserva.innerHTML = ''; // Limpiar el desplegable

        salas.forEach(sala => {
          // Agregar a la tabla
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${sala.id}</td>
            <td>${sala.nombre}</td>
            <td>${sala.capacidad}</td>
            <td>${sala.estado}</td>
            <td>
              <button class="editarSala" data-id="${sala.id}">Editar</button>
              <button class="eliminarSala" data-id="${sala.id}">Eliminar</button>
            </td>
          `;
          tablaSalas.appendChild(row);

          // Agregar al desplegable si la sala está activa
          if (sala.estado === 'activo') {
            const option = document.createElement('option');
            option.value = sala.id;
            option.textContent = sala.nombre;
            salaReserva.appendChild(option); // Usar salaReserva
          }
        });

        // Agregar eventos a los botones de acción
        document.querySelectorAll('.editarSala').forEach(button => {
          button.addEventListener('click', editarSala);
        });
        document.querySelectorAll('.eliminarSala').forEach(button => {
          button.addEventListener('click', eliminarSala);
        });
      });
  }

  // Función para editar una sala
  function editarSala(e) {
    const id = e.target.dataset.id;
    const nuevoNombre = prompt('Ingrese el nuevo nombre:');
    const nuevaCapacidad = prompt('Ingrese la nueva capacidad:');
    const nuevoEstado = prompt('Ingrese el nuevo estado (activo/inactivo):');

    if (nuevoNombre && nuevaCapacidad && nuevoEstado) {
      fetch(`http://localhost:3000/salas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nuevoNombre, capacidad: nuevaCapacidad, estado: nuevoEstado })
      }).then(() => actualizarSalas());
    }
  }

  // Función para eliminar una sala
  function eliminarSala(e) {
    const id = e.target.dataset.id;

    if (confirm('¿Seguro que desea eliminar esta sala?')) {
      fetch(`http://localhost:3000/salas/${id}`, { method: 'DELETE' })
        .then(() => actualizarSalas());
    }
  }

  // Reservas
  function cargarReservas() {
    fetch('http://localhost:3000/reservas')
      .then(response => response.json())
      .then(reservas => {
        // Limpiar la lista de reservas
        listaReservas.innerHTML = '';
  
        reservas.forEach(reserva => {
          const li = document.createElement('li');
          li.innerHTML = `
            Sala: ${reserva.salaId} - Reservante: ${reserva.nombre} - 
            Inicio: ${new Date(reserva.inicio).toLocaleString()} - 
            Fin: ${new Date(reserva.fin).toLocaleString()}
            <button class="editarReserva" data-id="${reserva.id}">Editar</button>
            <button class="eliminarReserva" data-id="${reserva.id}">Eliminar</button>
          `;
          listaReservas.appendChild(li);
        });
  
        // Agregar eventos a los botones
        agregarEventosReservas();
      });
  }
  
  // Función para agregar eventos a los botones de editar y eliminar
  function agregarEventosReservas() {
    document.querySelectorAll('.editarReserva').forEach(button => {
      button.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        mostrarFormularioEdicionReserva(id);
      });
    });
  
    document.querySelectorAll('.eliminarReserva').forEach(button => {
      button.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        eliminarReserva(id);
      });
    });
  }
  
  // Función para crear una nueva reserva
  reservaForm.addEventListener('submit', (e) => {
    e.preventDefault();
  
    const salaId = document.getElementById('salaReserva').value;
    const nombre = document.getElementById('nombreReservante').value;
    const inicio = document.getElementById('inicioReserva').value;
    const fin = document.getElementById('finReserva').value;
  
    // Validar los datos
    if (!salaId || !nombre || !inicio || !fin) {
      alert('Todos los campos son obligatorios.');
      return;
    }
  
    if (new Date(inicio) >= new Date(fin)) {
      alert('La fecha de inicio debe ser anterior a la fecha de fin.');
      return;
    }
  
    // Crear la reserva
    fetch('http://localhost:3000/reservas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ salaId, nombre, inicio, fin })
    }).then(() => {
      reservaForm.reset();
      cargarReservas();
    });
  });
  
  // Función para mostrar el formulario de edición de reserva
  function mostrarFormularioEdicionReserva(id) {
    fetch(`http://localhost:3000/reservas/${id}`)
      .then(response => response.json())
      .then(reserva => {
        const nuevoNombre = prompt('Ingrese el nuevo nombre del reservante:', reserva.nombre);
        const nuevoInicio = prompt('Ingrese la nueva fecha/hora de inicio (YYYY-MM-DDTHH:MM):', reserva.inicio);
        const nuevoFin = prompt('Ingrese la nueva fecha/hora de fin (YYYY-MM-DDTHH:MM):', reserva.fin);
  
        if (!nuevoNombre || !nuevoInicio || !nuevoFin) {
          alert('Todos los campos son obligatorios.');
          return;
        }
  
        if (new Date(nuevoInicio) >= new Date(nuevoFin)) {
          alert('La fecha de inicio debe ser anterior a la fecha de fin.');
          return;
        }
  
        // Actualizar la reserva
        fetch(`http://localhost:3000/reservas/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombre: nuevoNombre, inicio: nuevoInicio, fin: nuevoFin })
        }).then(() => cargarReservas());
      });
  }
  
  // Función para eliminar una reserva
  function eliminarReserva(id) {
    if (confirm('¿Está seguro de que desea eliminar esta reserva?')) {
      fetch(`http://localhost:3000/reservas/${id}`, { method: 'DELETE' })
        .then(() => cargarReservas());
    }
  }
  
  // Cargar las reservas al iniciar
  cargarReservas();

  // Agregar nueva sala
  salaForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = document.getElementById('nombreSala').value;
    const capacidad = document.getElementById('capacidadSala').value;
    const estado = document.getElementById('estadoSala').value;

    fetch('http://localhost:3000/salas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, capacidad, estado })
    }).then(() => {
      salaForm.reset();
      actualizarSalas();
    });
  });

  
  actualizarSalas();
});
