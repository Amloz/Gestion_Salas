const express = require('express');
const router = express.Router();

let salas = [];
let count = 0

router.get('/', (req, res) => res.json(salas));

router.post('/', (req, res) => {
  count ++;
  const { id = count, nombre, capacidad, estado } = req.body;
  salas.push({ id, nombre, capacidad, estado });
  res.status(201).send('Sala creada');
});

router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = salas.findIndex(s => s.id === id);
  if (index >= 0) {
    salas[index] = { ...salas[index], ...req.body };
    res.send('Sala actualizada');
  } else res.status(404).send('Sala no encontrada');
});

router.delete('/:id', (req, res) => {
  salas = salas.filter(s => s.id !== parseInt(req.params.id));
  res.send('Sala eliminada');
});

module.exports = router;
