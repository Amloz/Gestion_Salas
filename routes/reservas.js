const express = require('express');
const router = express.Router();

let reservas = [];

router.get('/', (req, res) => res.json(reservas));

router.post('/', (req, res) => {
  const { id, salaId, nombre, inicio, fin } = req.body;
  reservas.push({ id, salaId, nombre, inicio, fin });
  res.status(201).send('Reserva creada');
});

router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = reservas.findIndex(r => r.id === id);
  if (index >= 0) {
    reservas[index] = { ...reservas[index], ...req.body };
    res.send('Reserva actualizada');
  } else res.status(404).send('Reserva no encontrada');
});

router.delete('/:id', (req, res) => {
  reservas = reservas.filter(r => r.id !== parseInt(req.params.id));
  res.send('Reserva eliminada');
});

module.exports = router;
