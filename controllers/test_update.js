const fs = require('fs');

var port_dispo = fs.readFileSync('../PORT_ASSIGN.txt','utf-8');

var update_port_dispo = Number(port_dispo);
      update_port_dispo = update_port_dispo + 1;

      const txtWrite = update_port_dispo.toString();

      fs.writeFileSync('../PORT_ASSIGN.txt', txtWrite);