# Projeto - Agente Autônomo com Busca

## 🧩 Descrição

Este projeto consiste em um agente autônomo com capacidade de busca, desenvolvido com foco em execução no ambiente web.

---

## 🚀 Como rodar o ambiente de desenvolvimento

### Pré-requisitos

* Docker Desktop instalado e em execução

### Passos

1. Na raiz do projeto, execute o comando abaixo para buildar e iniciar os containers:

```bash
docker compose up --build --force-recreate
```

2. Após a primeira execução, nas próximas vezes você pode utilizar apenas:

```bash
docker compose up
```

3. A aplicação estará disponível em:

```bash
http://localhost:5173
```

---

## 💡 Observações

* O comando com `--build --force-recreate` deve ser utilizado quando houver mudanças em dependências ou na configuração dos containers.
* Para alterações simples no código, apenas o `docker compose up` já é suficiente.
* Certifique-se de que nenhuma outra aplicação esteja utilizando a porta 5173.
