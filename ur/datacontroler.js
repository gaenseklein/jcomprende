const fs = require('fs').promises;
const express = require('express');

const datacontroler = {
  frontpage: async function(){
      let dataFrontpage=[];
      console.log('linea 7 datacontroler dataFrontpage es : ', dataFrontpage);
      return dataFrontpage;
    }
  }

module.exports = datacontroler;
