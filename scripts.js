const btnListar = document.querySelector('#btn-produto')
const produtoForm = document.querySelector('#form-produtos')

produtoForm.addEventListener("submit", function (event) {
    event.preventDefault();

    let produtoForm = new FormData(document.querySelector('#form-produtos')).entries();
    let formData = Object.fromEntries(produtoForm);

})


const getLocalStorage = () => JSON.parse(localStorage.getItem('form_produtos')) ?? []
const setLocalStorage = (formCadastro) => localStorage.setItem('form_produtos', JSON.stringify(formCadastro));



const deleteProduto = (index) => {
    const formCadastro = readProduto()
    formCadastro.splice(index, 1)
    setLocalStorage(formCadastro)
}



const updateProduto = (index, produtos) => {
    const formCadastro = readProduto();
    formCadastro[index] = produtos
    setLocalStorage(formCadastro);

}


const readProduto = () => getLocalStorage();

function criarProduto(produtos) {
    const formCadastro = getLocalStorage()
    formCadastro.push(produtos)
    setLocalStorage(formCadastro)
}


// const clearFields = () => {
//     const fields = document.querySelectorAll("input")
//     fields.forEach(field => field.value = "")
// }

const salvarProduto = () => {
    if (validation()) {
        const produto = {
            nome: document.getElementById('nome-produto').value,
            custo: document.getElementById('preco-custo').value,
            venda: document.getElementById('preco-venda').value,
            data: document.getElementById('data-produto').value,
            estoque: document.getElementById('produto-estoque').value

        }
        const index = document.getElementById('nome-produto').dataset.index
        if(index == 'new'){
            criarProduto(produto)
            updateTable()
        } else {
            updateProduto(index, produto)
            updateTable()
        }
        
        // clearFields()
    }
}

const createRow = (produto, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td>${produto.nome}</td>
        <td>${produto.custo}</td>
        <td>${produto.venda}</td>
        <td>${produto.data}</td>
        <td>${produto.estoque}</td>
        <td>
            <button type="button" class="button-editar" id="editar-${index}">Editar</button>
            <button type="button" class="button-excluir" id="excluir-${index}">X</button>        
        </td>
    `
    document.querySelector('#table_produtos>tbody').appendChild(newRow)
}

const clearTable = () => {
    const rows = document.querySelectorAll('#table_produtos>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
    const formCadastro = readProduto()
    clearTable()
    formCadastro.forEach(createRow)
}


updateTable()

const preencherCampos = (produto) => {
    document.getElementById('nome-produto').value = produto.nome
    document.getElementById('preco-custo').value = produto.custo
    document.getElementById('preco-venda').value = produto.venda
    document.getElementById('data-produto').value = produto.data
    document.getElementById('produto-estoque').value = produto.estoque
    document.getElementById('nome-produto').dataset.index = produto.index
}

const editProduto = (index) => {
    const produto = readProduto()[index]
    produto.index = index
    preencherCampos(produto)
}

const editDelete = (event) => {
    if (event.target.type == "button") {
        const [action, index] = event.target.id.split('-')

        if (action == 'editar') {
            editProduto(index)
        } else {
            const produto = readProduto()[index]
            const response = confirm(`Deseja Excluir o Produto ${produto.nome}`)
            if(response) {
                deleteProduto(index)
                updateTable()
            }
            
        }
    }

}



// Eventos
document.getElementById('btn-produto')
    .addEventListener('click', salvarProduto)


document.querySelector('#table_produtos>tbody')
    .addEventListener('click', editDelete)




function validation() {
    const errorSpan = document.getElementById('error')
    const limiteProduto = document.getElementById('nome-produto')
    const minCaracteres = limiteProduto.value
    const minLength = 10;

    const minCusto = document.getElementById('preco-custo')
    const minVenda = document.getElementById('preco-venda')
    const precoInicialCusto = minCusto.value
    const precoInicialVenda = minVenda.value
    const minCustoVEnda = 0;

    const minEstoque = document.getElementById('produto-estoque')
    const qntMinEstoque = minEstoque.value

    const data = new Date()

    const minValidade = document.getElementById('data-produto');
    let validadeInicial = new Date(minValidade.value)
    if (minCaracteres.length < 10) {
        errorSpan.textContent = `O texto deve ter pelo menos ${minLength} caracteres.`;
        return false;
    } else {
        if (precoInicialCusto <= 0 && precoInicialVenda >= 0) {
            errorSpan.textContent = `O preço do Produto não pode ser Zero`;
            return false;
        } else {
            if (qntMinEstoque > 100) {
                errorSpan.textContent = `A quantidade de Estoque não pode ser Maior que 100`;
                return false;
            } else {
                if (qntMinEstoque <= 0) {
                    errorSpan.textContent = `A quantidade de Estoque não pode ser Zero`;
                    return false;
                } else {
                    if (validadeInicial <= data) {
                        errorSpan.textContent = `A data de Validade não pode ser Menor ou Igual a Data Atual`;
                        return false;
                    } else {
                        if (validadeInicial >= data.setFullYear(data.getFullYear() + 10)) {
                            errorSpan.textContent = `A data de validade não pode ser maior ou igual a 10 anos`;
                            return false;
                        } else {
                            errorSpan.textContent = '';
                            return true;
                        }
                    }
                }

            }
        }

    }
}



