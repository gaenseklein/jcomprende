const datacontroler = require('../datacontroler.js');
const templates = require('../templates.js');
const router = require('express').Router();

//frontpage:
router.get('/', async (req,res)=>{
  try {
    let data = await datacontroler.frontpage();
    response = templates.buildPage('frontpage',data);
    res.send(response);
  } catch (e) {
    console.warn(e);
    res.status(400).send('oops, something went wrong del urRoute');
  }
});

module.exports = router;
