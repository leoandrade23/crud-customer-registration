const qS = (el) => document.querySelector(el);
const qSAll = (el) => document.querySelectorAll(el);

// Abrir e Fechar Modal

const openModal = () => qS(".modal").classList.add("active");

const closeModal = () => {
  clearFields();
  qS(".modal").classList.remove("active");
};

// Função para diferençar a criação da edição de cliente

const newClient = () => {
  qS("#nome").dataset.status = "new";
  qS(".modal--header h2").textContent = "Novo Cliente";
  openModal();
};

// Evento nos botões de cadastrar e fechar modal

qS("#cadastrarCliente").addEventListener("click", newClient);

qS(".modal--close").addEventListener("click", closeModal);

qS("#cancelar").addEventListener("click", closeModal);

// Local Storage

const getDb = () => JSON.parse(localStorage.getItem("db_client")) ?? [];

const setDb = (dbClient) =>
  localStorage.setItem("db_client", JSON.stringify(dbClient));

// CRUD - Create, Read, Update, Delete

const deleteClient = (index) => {
  const db_client = readClient();
  db_client.splice(index, 1);
  setDb(db_client);
};

const updateClient = (index, client) => {
  const dbClient = readClient();
  dbClient[index] = client;
  setDb(dbClient);
};

const readClient = () => getDb();

const createClient = (client) => {
  const dbClient = getDb();
  dbClient.push(client);
  setDb(dbClient);
};

// Manipular o modal criando/atualizando cliente

const fieldsValidation = () => {
  return qS(".modal--form").reportValidity();
};

const clearFields = () => {
  qSAll(".modal--field").forEach((field) => {
    field.value = "";
  });
};

const saveClient = () => {
  if (fieldsValidation()) {
    const client = {
      nome: qS("#nome").value,
      email: qS("#email").value,
      celular: qS("#celular").value,
      cidade: qS("#cidade").value,
    };
    const status = qS("#nome").dataset.status;
    if (status == "new") {
      createClient(client);
      updateData();
      closeModal();
    } else {
      updateClient(status, client);
      updateData();
      closeModal();
    }
  }
};

// Salvar clicando no botão "Salvar"

qS("#salvar").addEventListener("click", saveClient);

// Salvar com a tecla "Enter"

const keyEnter = (event) => {
  if (event.key == "Enter") {
    saveClient();
  }
};

qS(".modal").addEventListener("keyup", keyEnter);

// Função para criar as linhas para cada cliente na tabela

const createRow = (client, index) => {
  qS(".records tbody").innerHTML += `
  <tr>
    <td>${client.nome}</td>
    <td>${client.email}</td>
    <td>${client.celular}</td>
    <td>${client.cidade}</td>
    <td>
      <button type="button" class="button green" data-action="edit-${index}">Editar</button>
      <button type="button" class="button red" data-action="delete-${index}">Excluir</button>
    </td>
  </tr>
  `;
};

// Função para limpar os dados evitando de duplicar a tabela

const clearData = () => {
  qS(".records tbody").innerHTML = "";
};

// Função para atualizar a tabela

const updateData = () => {
  clearData();
  const dbClient = readClient();
  dbClient.forEach(createRow);
};

// Botões Editar / Excluir

const fillFields = (client, index) => {
  qS(".modal--header h2").textContent = "Editar Cliente";
  qS("#nome").value = client.nome;
  qS("#nome").dataset.status = index;
  qS("#email").value = client.email;
  qS("#celular").value = client.celular;
  qS("#cidade").value = client.cidade;
};

const editClient = (index) => {
  const client = readClient()[index];
  fillFields(client, index);
  openModal();
};

const actionButtons = (event) => {
  const button = event.target.type;
  if (button === "button") {
    const [action, index] = event.target.dataset.action.split("-");
    if (action === "edit") {
      editClient(index);
    } else if (action === "delete") {
      const client = readClient()[index];
      const response = confirm(
        `Deseja excluir o cadastro do cliente ${client.nome}`
      );
      if (response) {
        deleteClient(index);
        updateData();
      }
    }
  }
};

qS(".records").addEventListener("click", actionButtons);

// Chamando a função para abrir a página com a tabela atualizada

updateData();
