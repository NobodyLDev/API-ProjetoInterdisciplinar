const apiBase = window.location.protocol.startsWith("http") ? window.location.origin : "http://localhost:3000";
let materials = [];
let products = [];
let simulationCount = 0;

const notification = document.getElementById("notification");

async function initApp() {
  setupSectionButtons();
  setupProductMaterialRows();
  document.getElementById("material-form").addEventListener("submit", onMaterialSubmit);
  document.getElementById("product-form").addEventListener("submit", onProductSubmit);
  document.getElementById("simulation-form").addEventListener("submit", onSimulationSubmit);
  document.getElementById("add-material-row").addEventListener("click", addMaterialRow);

  await refreshData();
}

function setupSectionButtons() {
  document.querySelectorAll(".sidebar-link").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".sidebar-link").forEach((link) => link.classList.remove("active"));
      button.classList.add("active");
      document.querySelectorAll(".section").forEach((section) => section.classList.remove("active"));
      document.getElementById(button.dataset.section).classList.add("active");
    });
  });
}

function setupProductMaterialRows() {
  addMaterialRow();
}

function createMaterialRow() {
  const row = document.createElement("div");
  row.className = "material-row";

  const select = document.createElement("select");
  select.name = "materialId";
  select.required = true;
  populateMaterialOptions(select);

  const input = document.createElement("input");
  input.name = "quantidade";
  input.type = "number";
  input.min = "1";
  input.placeholder = "Quantidade";
  input.required = true;

  row.append(select, input);
  return row;
}

function addMaterialRow() {
  const container = document.getElementById("product-material-rows");
  const row = createMaterialRow();
  container.appendChild(row);
}

function populateMaterialOptions(selectElement) {
  selectElement.innerHTML = "";
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Selecione o material";
  selectElement.appendChild(defaultOption);

  materials.forEach((material) => {
    const option = document.createElement("option");
    option.value = material.id;
    option.textContent = `${material.nome} (${material.quantidade})`;
    selectElement.appendChild(option);
  });
}

async function refreshData() {
  await Promise.all([loadMaterials(), loadProducts()]);
  updateDashboard();
}

async function loadMaterials() {
  try {
    const response = await fetch(`${apiBase}/materials`);
    materials = await response.json();
    renderMaterials();
    document.querySelectorAll("select[name='materialId']").forEach(populateMaterialOptions);
  } catch (error) {
    showNotification("Não foi possível carregar os materiais.", true);
  }
}

async function loadProducts() {
  try {
    const response = await fetch(`${apiBase}/products`);
    products = await response.json();
    renderProducts();
    populateSimulationProducts();
  } catch (error) {
    showNotification("Não foi possível carregar os produtos.", true);
  }
}

function renderMaterials() {
  const list = document.getElementById("materials-list");
  list.innerHTML = "";

  if (!materials.length) {
    list.innerHTML = `<div class="card-item empty-state"><h4>Nenhum material cadastrado</h4><p>Adicione materiais para começar a montar produtos e simular produção.</p></div>`;
    return;
  }

  materials.forEach((material) => {
    const card = document.createElement("article");
    card.className = "card-item";
    card.innerHTML = `<h4>${material.nome}</h4><p>Quantidade em estoque: <strong>${material.quantidade}</strong></p>`;
    list.appendChild(card);
  });
}

function renderProducts() {
  const list = document.getElementById("products-list");
  list.innerHTML = "";

  if (!products.length) {
    list.innerHTML = `<div class="card-item empty-state"><h4>Nenhum produto cadastrado</h4><p>Cadastre produtos para planejar a produção.</p></div>`;
    return;
  }

  products.forEach((product) => {
    const card = document.createElement("article");
    card.className = "card-item";
    const materialsText = (product.materiais || [])
      .map((item) => {
        const material = materials.find((m) => m.id === item.materialId);
        return `${material ? material.nome : 'Material desconhecido'}: ${item.quantidade}`;
      })
      .join("<br />");

    card.innerHTML = `
      <h4>${product.nome}</h4>
      <p>Quantidade por produção: <strong>${product.quantidade}</strong></p>
      <p><strong>Materiais:</strong><br />${materialsText || 'Nenhum material definido'}</p>
    `;
    list.appendChild(card);
  });
}

function populateSimulationProducts() {
  const select = document.getElementById("simulation-product");
  select.innerHTML = "<option value=\"\">Selecione um produto</option>";
  products.forEach((product) => {
    const option = document.createElement("option");
    option.value = product.id;
    option.textContent = `${product.nome}`;
    select.appendChild(option);
  });
}

async function onMaterialSubmit(event) {
  event.preventDefault();
  const name = document.getElementById("material-name").value.trim();
  const quantity = Number(document.getElementById("material-quantity").value);

  if (!name || quantity <= 0) {
    return showNotification("Preencha o nome e a quantidade corretamente.", true);
  }

  try {
    await fetch(`${apiBase}/materials`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: name, quantidade: quantity }),
    });

    document.getElementById("material-form").reset();
    await refreshData();
    showNotification("Material cadastrado com sucesso.");
  } catch (error) {
    showNotification("Não foi possível cadastrar o material.", true);
  }
}

async function onProductSubmit(event) {
  event.preventDefault();
  const name = document.getElementById("product-name").value.trim();
  const quantity = Number(document.getElementById("product-quantity").value);
  const rows = Array.from(document.querySelectorAll("#product-material-rows .material-row"));

  if (!name || quantity <= 0) {
    return showNotification("Informe nome e quantidade válidos para o produto.", true);
  }

  const materiais = rows
    .map((row) => {
      const materialId = Number(row.querySelector("select").value);
      const quantidade = Number(row.querySelector("input").value);
      return materialId && quantidade > 0 ? { materialId, quantidade } : null;
    })
    .filter(Boolean);

  if (!materiais.length) {
    return showNotification("Adicione ao menos um material com quantidade válida.", true);
  }

  try {
    await fetch(`${apiBase}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: name, quantidade, materiais }),
    });

    document.getElementById("product-form").reset();
    document.getElementById("product-material-rows").innerHTML = "";
    addMaterialRow();
    await refreshData();
    showNotification("Produto cadastrado com sucesso.");
  } catch (error) {
    showNotification("Não foi possível cadastrar o produto.", true);
  }
}

async function onSimulationSubmit(event) {
  event.preventDefault();
  const productId = Number(document.getElementById("simulation-product").value);
  const quantity = Number(document.getElementById("simulation-quantity").value);

  if (!productId || quantity <= 0) {
    return showNotification("Selecione um produto e informe uma quantidade válida.", true);
  }

  try {
    const response = await fetch(`${apiBase}/simulate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantidade: quantity }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Falha na simulação.");
    }

    const result = await response.json();
    simulationCount += 1;
    renderSimulationResult(result, quantity);
    document.getElementById("stat-last-run").textContent = new Date().toLocaleString();
    updateDashboard();
    showNotification("Simulação realizada com sucesso.");
  } catch (error) {
    showNotification(error.message || "Não foi possível simular a produção.", true);
  }
}

function renderSimulationResult(result, requested) {
  const container = document.getElementById("simulation-result");
  container.innerHTML = "";

  const content = document.createElement("div");
  content.className = "card-item";
  content.innerHTML = `
    <h4>Resultado da simulação</h4>
    <p><strong>Pedido:</strong> ${requested} unidades</p>
    <p><strong>Produção possível:</strong> ${result.possivel ? "Sim" : "Não"}</p>
    <p><strong>Máximo possível:</strong> ${result.maximoProducao}</p>
  `;

  const materialsCard = document.createElement("div");
  materialsCard.className = "card-item";
  materialsCard.innerHTML = "<h4>Materiais necessários</h4>";

  if (result.materiaisNecessarios.length) {
    const list = document.createElement("ul");
    result.materiaisNecessarios.forEach((item) => {
      const row = document.createElement("li");
      row.textContent = `${item.material}: precisa ${item.necessario}, em estoque ${item.emEstoque}`;
      list.appendChild(row);
    });
    materialsCard.appendChild(list);
  } else {
    materialsCard.innerHTML += "<p>Nenhum material listado.</p>";
  }

  container.appendChild(content);
  container.appendChild(materialsCard);
}

function updateDashboard() {
  document.getElementById("stat-materials").textContent = String(materials.length);
  document.getElementById("stat-products").textContent = String(products.length);
  document.getElementById("stat-low-stock").textContent = String(materials.filter((m) => Number(m.quantidade) <= 10).length);
  document.getElementById("stat-total-units").textContent = String(materials.reduce((sum, item) => sum + Number(item.quantidade), 0));
  document.getElementById("stat-simulations").textContent = String(simulationCount);
}

function showNotification(message, isError = false) {
  notification.textContent = message;
  notification.className = `notification visible ${isError ? "error" : ""}`;
  setTimeout(() => {
    notification.classList.remove("visible");
  }, 3800);
}

window.addEventListener("load", initApp);
