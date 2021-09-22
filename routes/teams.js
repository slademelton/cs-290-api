const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        data: "Get all teams"
    })
 })
 
 router.post('/', (req, res) => {
     res.status(201).json({
         success: true,
         data: "Create new team"
     })
  })
 
  router.get('/:id', (req, res) => {
     res.status(201).json({
         success: true,
         data: `Get information about team with id of ${req.params.id}`
     })
  })
 
  router.put('/:id', (req, res) => {
     res.status(201).json({
         success: true,
         data: `Update team with id of ${req.params.id}`
     })
  })
 
router.delete('/:id', (req, res) => {
     res.status(201).json({
         success: true,
         data: `Delete team with id of ${req.params.id}`
     })
  })
 
 module.exports = router;
 
 
 
 