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


## Estrutura de Pastas

O projeto foi desenvolvido utilizando **React** no modelo de **Single Page Application (SPA)**, com organização modular para facilitar manutenção e escalabilidade.

### 📁 `src/components`
Responsável por armazenar os componentes reutilizáveis da aplicação. Cada componente possui sua própria pasta, contendo sua estrutura isolada.

### 📁 `src/types`
Contém definições de tipos (interfaces e types do TypeScript) que são compartilhados entre diferentes partes do sistema, promovendo tipagem consistente.

### 📁 `src/utils`
Armazena funções utilitárias reutilizáveis, como formatações, helpers e regras de negócio genéricas.

---

## Padrão de Criação de Componentes

Para manter consistência e organização no projeto, os componentes seguem um padrão definido:

### 📌 Nomenclatura
- O nome das pastas dos componentes deve seguir o padrão **PascalCase**
- O nome da pasta deve ser o mesmo do componente

### 📦 Estrutura do Componente
Cada componente deve conter:

- `index.tsx`: arquivo principal do componente  
- `styles.module.css`: arquivo de estilos utilizando **CSS Modules**

### 🎨 Estilização
- Utiliza-se **CSS Modules** para evitar conflitos de escopo entre estilos  
- Cada componente possui seu próprio arquivo de estilo isolado  

---

## Fluxo de Trabalho com GitHub

Para garantir um fluxo de desenvolvimento organizado e colaborativo, siga as diretrizes abaixo:

### 🌿 Criação de Branches
- Sempre crie uma nova branch para cada funcionalidade ou correção  
- Nomeie a branch de forma descritiva, por exemplo:
  - `feature/login-page`
  - `fix/header-bug`

### ✅ Desenvolvimento
- Implemente a funcionalidade completa na branch criada  
- Realize testes para garantir que não há erros antes de subir o código  

### 🔁 Pull Request
- Após finalizar a implementação, abra um **Pull Request** para a branch `main`  
- Descreva claramente o que foi feito  

### 📝 Padrão de Commits
Utilize, preferencialmente, o padrão **Conventional Commits**:

```bash
tipo(dominio): descricao
```

### Exemplos

```
feat(auth): adiciona tela de login
```

```
fix(header): corrige alinhamento do menu
```