let clients = [];
let contract = null;

module.exports = {
  getContract: function () {
    return contract;
  },
  setContract: function (newContract) {
    contract = newContract;
  },
  getClients: function () {
    return clients;
  },
  addClient: function (client) {
    clients.push(client);
  },
  removeClient: function (client) {
    clients = clients.filter((c) => c !== client);
  },
};
