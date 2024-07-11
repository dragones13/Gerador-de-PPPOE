var listaEmails = [];
var itensPorPagina = 5;
var paginaAtual = 1;

window.onload = function() {
    if (localStorage.getItem('emails')) {
        listaEmails = JSON.parse(localStorage.getItem('emails'));
        atualizarResultados();
        atualizarPaginacao();
    }
};

function gerarEmail() {
    var usuario = document.getElementById("usuario").value.trim();
    var dominio = document.getElementById("dominio").value.trim();
    
    if (usuario === "") {
        alert("Por favor, digite um nome de usuário válido.");
        return;
    }
    
    if (dominio === "") {
        alert("Por favor, digite um domínio válido.");
        return;
    }
    
    var email = usuario + "@" + dominio;
    
    listaEmails.push({ email: email });
    
    atualizarResultados();
    atualizarPaginacao();
    
    document.getElementById("usuario").value = "";
    
    salvarListaEmails();
}

function gerarEmailESenha() {
    var dominio = document.getElementById("dominio").value.trim();
    
    if (dominio === "") {
        alert("Por favor, digite um domínio válido.");
        return;
    }
    
    var usuario = gerarUsuarioAleatorio(8);
    var senha = gerarSenha(8);
    var email = usuario + "@" + dominio;
    
    listaEmails.push({ email: email, senha: senha });
    
    atualizarResultados();
    atualizarPaginacao();
    
    salvarListaEmails();
}

function gerarSenha(comprimento) {
    var caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var senha = "";

    for (var i = 0; i < comprimento; i++) {
        var randomIndex = Math.floor(Math.random() * caracteres.length);
        senha += caracteres[randomIndex];
    }

    return senha;
}

function gerarUsuarioAleatorio(comprimento) {
    var caracteres = "abcdefghijklmnopqrstuvwxyz0123456789";
    var usuario = "";

    for (var i = 0; i < comprimento; i++) {
        var randomIndex = Math.floor(Math.random() * caracteres.length);
        usuario += caracteres[randomIndex];
    }

    return usuario;
}

function atualizarResultados() {
    var resultadosDiv = document.getElementById("resultados");
    resultadosDiv.innerHTML = "";
    
    var indiceInicial = (paginaAtual - 1) * itensPorPagina;
    var indiceFinal = indiceInicial + itensPorPagina;
    
    var listaPaginada = listaEmails.slice(indiceInicial, indiceFinal);
    
    listaPaginada.forEach(function(item) {
        var p = document.createElement("p");
        var spanEmail = document.createElement("span");
        spanEmail.textContent = "E-mail: " + item.email;
        p.appendChild(spanEmail);
        
        if (item.senha) {
            var spanSenha = document.createElement("span");
            spanSenha.textContent = "Senha: " + item.senha;
            p.appendChild(spanSenha);
        }
        
        var btnCopiarEmail = document.createElement("button");
        btnCopiarEmail.textContent = "Copiar E-mail";
        btnCopiarEmail.onclick = function() {
            copiarParaClipboard(item.email);
        };
        p.appendChild(btnCopiarEmail);
        
        if (item.senha) {
            var btnCopiarSenha = document.createElement("button");
            btnCopiarSenha.textContent = "Copiar Senha";
            btnCopiarSenha.onclick = function() {
                copiarParaClipboard(item.senha);
            };
            p.appendChild(btnCopiarSenha);
        }
        
        var btnRemover = document.createElement("button");
        btnRemover.textContent = "Remover";
        btnRemover.onclick = function() {
            removerEmail(listaEmails.indexOf(item));
        };
        p.appendChild(btnRemover);
        
        resultadosDiv.appendChild(p);
    });
}

function atualizarPaginacao() {
    var paginationDiv = document.getElementById("pagination");
    paginationDiv.innerHTML = "";
    
    var numPaginas = Math.ceil(listaEmails.length / itensPorPagina);
    
    for (var i = 1; i <= numPaginas; i++) {
        var btnPagina = document.createElement("button");
        btnPagina.textContent = i;
        btnPagina.onclick = function() {
            paginaAtual = parseInt(this.textContent);
            atualizarResultados();
        };
        paginationDiv.appendChild(btnPagina);
    }
}

function copiarParaClipboard(texto) {
    var textarea = document.createElement('textarea');
    textarea.value = texto;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    alert('Texto copiado para o clipboard: ' + texto);
}

function removerEmail(index) {
    listaEmails.splice(index, 1);
    
    atualizarResultados();
    atualizarPaginacao();
    
    salvarListaEmails();
}

function salvarListaEmails() {
    localStorage.setItem('emails', JSON.stringify(listaEmails));
}

function downloadEmails() {
    var csvContent = "data:text/csv;charset=utf-8,";
    
    // Cabeçalho do CSV
    csvContent += "E-mail\n";
    
    // Adiciona cada e-mail ao string CSV
    listaEmails.forEach(function(item) {
        csvContent += '"' + item.email + '",' + item.senha + '\n';
    });
    
    // Cria um elemento <a> para iniciar o download
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "emails.csv");
    document.body.appendChild(link);
    
    // Simula o clique no link para iniciar o download
    link.click();
    
    // Remove o elemento <a> após o download
    document.body.removeChild(link);
}

function limparTudo() {
    listaEmails = [];
    atualizarResultados();
    atualizarPaginacao();
    salvarListaEmails();
}
