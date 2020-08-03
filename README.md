
# Sthore

### Descrição

API de loja online feita para o desafio da Sthorm, integrada com o API E-Commerce da Cielo.

### Instalação

```bash
$ npm install
```

Instale o Docker, depois rode:

```bash
$ docker-compose up -d
```

Use o adminer (`http://localhost:8080`) para criar uma base da dados. As credenciais padrões são:

```
Servidor: pgsql
Usuário: pguser
Senha: pgpassword
```

Após criar uma base de dados, coloque o nome dela em uma variável de ambiente chamada `PGDB`

Ex:
```bash
$ export PGDB="db_dev"
```

### Executando

```bash
# para desenvolvimento
$ npm run start

# a cada alteração em arquivos, ele recarrega a aplicação
$ npm run start:dev

# modo em produção
$ npm run start:prod
```

### Testes

```bash
# testes unitários
$ npm run test

# testes de integração
$ npm run test:e2e

# coverage dos testes
$ npm run test:cov
```

### Exemplo rodando
Você pode usar ela rodando em:
`https://desafio-sthore.herokuapp.com/`

### Endpoints

`#### GET /produto?limit=25&page=1`

Retorna: Lista dos produtos cadastrados
Código: 200
Query: `limit`: Quantidade de elementos por página. Máx: 25; Padrão: 25
       `page`: Página de produtos. Padrão: 1
Detalhes do retorno:

Campo | Tipo
----- | ----
produtos | Array de Produto
total | Inteiro. Quantidade total de produtos armazenados

##### Produto

Campo | Tipo
----- | ----
id | Inteiro. Identificador do produto
nome | String. Nome do produto
descricao | String. Descrição do produto
preco | Double. Valor do produto (em R$)
fotos | Array de Foto

##### Foto

Campo | Tipo
----- | ----
id | Inteiro. Identificador da foto
linkFoto | String. Link da foto para ser exibida.

`### GET /produto/:id`
Retorna: Detalhes do produto especificado
Código: 200
Parâmetros: `id`: Identificador do produto
Detalhes do retorno:
Campo | Tipo
----- | ----
id | Inteiro. Identificador do produto
nome | String. Nome do produto
descricao | String. Descrição do produto
preco | Double. Valor do produto (em R$)
fotos | Array de Foto

Caso o `id` seja inválido, retorna: 404

`### POST /produto`
Retorna: Detalhes do produto criado
Código: 201
Corpo:
Campo | Tipo
----- | ----
nome | String. Nome do produto
descricao | String. Descrição do produto
preco | Double. Valor do produto (em R$)
fotos | Array de Strings com os links das fotos

Caso algum dado seja inválido, ou algum outro erro, retorna: 500

Detalhes do retorno:
Campo | Tipo
----- | ----
id | Inteiro. Identificador do produto
nome | String. Nome do produto
descricao | String. Descrição do produto
preco | Double. Valor do produto (em R$)
fotos | Array de Foto


`### GET /compras/:orderCod`
Retorna: Status do pagamento da compra
Código: 200
Parâmetros: `orderId`: Código de 6 caracteres que identifica a compra

Caso o `orderId` seja inválido, retorna: 404

Detalhes do retorno:
Campo | Tipo
----- | ----
valor | Double. Valor total da compra
status | String. Status da Compra (Aguardando, Confirmada ou Finalizada)

`### POST /compras`
Retorna: Código de 6 caracteres da compra criada
Código: 201
Corpo:
Campo | Tipo
----- | ----
cliente | Objeto. Informações do Cliente
pagamento | Objeto. Informações do Cartão de Crédito para pagamento
valorTotal | Double. Valor total da compra
produtos | Array de Inteiros com os ids dos Produtos

Caso algum dos produtos informados não exista, retorna: 404
Caso algum dos dados de pagamento seja inválido, retorna: 401

Detalhes do retorno:
Campo | Tipo
----- | ----
mensagem | String. Mensagem informando sucesso
code | String. Código de 6 dígitos para identificar a compra


##### Cliente

Campo | Tipo
----- | ----
nome | String. Nome completo do Cliente
telefone | String. Telefone do Cliente
email | String. Email do Cliente
endereco | String. Endereço do Cliente

##### Pagamento

Campo | Tipo
----- | ----
bandeira | String. Bandeira do Cartão de Crédito ('visa', 'master', 'discovery', 'elo', 'jcb', 'amex', 'aura', 'hipercard', 'diners')
numero | String. Número do Cartão de Crédito
validade | String. Validade do Cartão de Crédito ('MM/YYYY')
titular | String. Titular do Cartão de Crédito
