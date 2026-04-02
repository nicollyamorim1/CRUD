// 1. Seleção de Elementos e Dados Iniciais
const form = document.getElementById('form-transacao');
const listaTransacoes = document.getElementById('lista-transacoes');
const displayEntradas = document.getElementById('total-entradas');
const displaySaidas = document.getElementById('total-saidas');
const displaySaldo = document.getElementById('saldo-total');

// Busca do LocalStorage ou inicia vazio
let transacoes = JSON.parse(localStorage.getItem('financas')) || [];

// 2. Função para Adicionar Transação
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const descricao = document.getElementById('descricao').value;
    const valor = parseFloat(document.getElementById('valor').value);
    const tipo = document.getElementById('tipo').value;

    const novaTransacao = {
        id: Math.floor(Math.random() * 10000), // Gera um ID único simples
        descricao,
        valor,
        tipo
    };

    transacoes.push(novaTransacao);
    atualizarApp();
    form.reset();
});

// 3. Função para Atualizar os Totais (Os Cards do Topo)
function calcularTotais() {
    // Somar apenas as entradas
    const entradas = transacoes
        .filter(item => item.tipo === 'entrada')
        .reduce((acc, item) => acc + item.valor, 0);

    // Somar apenas as saídas
    const saidas = transacoes
        .filter(item => item.tipo === 'saida')
        .reduce((acc, item) => acc + item.valor, 0);

    const saldo = entradas - saidas;

    // Atualizar os textos na tela
    displayEntradas.textContent = `R$ ${entradas.toFixed(2)}`;
    displaySaidas.textContent = `R$ ${saidas.toFixed(2)}`;
    displaySaldo.textContent = `R$ ${saldo.toFixed(2)}`;

    // Mudar cor do saldo se for negativo
    displaySaldo.parentElement.style.color = saldo < 0 ? 'red' : 'green';
}

// 4. Função para Renderizar a Tabela
function renderizarTabela() {
    listaTransacoes.innerHTML = "";

    transacoes.forEach((item, index) => {
        const linha = document.createElement('tr');
        
        // Estilo da cor do valor na tabela
        const corValor = item.tipo === 'entrada' ? 'text-entrada' : 'text-saida';

        linha.innerHTML = `
            <td>${item.descricao}</td>
            <td class="${corValor}">R$ ${item.valor.toFixed(2)}</td>
            <td>${item.tipo === 'entrada' ? '🔼' : '🔽'}</td>
            <td>
                <button onclick="removerTransacao(${index})">🗑️</button>
            </td>
        `;
        listaTransacoes.appendChild(linha);
    });
}

// 5. Funções de Apoio
function removerTransacao(index) {
    transacoes.splice(index, 1);
    atualizarApp();
}

function atualizarApp() {
    localStorage.setItem('financas', JSON.stringify(transacoes));
    renderizarTabela();
    calcularTotais();
}

// Iniciar o app ao carregar a página
atualizarApp();