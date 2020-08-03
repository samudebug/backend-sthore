import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpService, HttpModule } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { async } from 'rxjs';

const validIds = [];

describe('App (e2e)', () => { 
  let app: INestApplication;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, HttpModule],
      providers: []
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  })  

  describe('ProdutosController', () => {
   

  
    it('can POST, GET the post one', async () => {
      const produto = {
        nome: "mockNome",
        descricao: "mockDescricao",
        preco: 22.22,
        fotos: ["mockLink"]
      }
      let data = await request(app.getHttpServer())
      .post('/produto')
      .send(produto)
      .expect(201);
  
      expect(data.body).toEqual({
        nome: produto.nome,
        descricao: produto.descricao,
        preco: produto.preco,
        fotos: [
          {
            linkFoto: produto.fotos[0],
            id: expect.any(Number)
          }
        ],
        id: expect.any(Number),
      });
  
      data = await request(app.getHttpServer()).get('/produto').expect(200);
      expect(data.body).toEqual({
        produtos: expect.any(Array),
        total: 1
      });
      expect(data.body.produtos[0]).toEqual({
        nome: produto.nome,
        descricao: produto.descricao,
        preco: produto.preco,
        fotos: [
          {
            linkFoto: produto.fotos[0],
            id: expect.any(Number)
          }
        ],
        id: expect.any(Number),
      });
  
      data = await request(app.getHttpServer()).get(`/produto/${data.body.produtos[0].id}`).expect(200);
      expect(data.body).toEqual({
        nome: produto.nome,
        descricao: produto.descricao,
        preco: produto.preco,
        fotos: [
          {
            linkFoto: produto.fotos[0],
            id: expect.any(Number)
          }
        ],
        id: expect.any(Number),
      });
      validIds.push(data.body.id);

    });
    it('cannot GET invalid product', async () => {
      await request(app.getHttpServer()).get('/produto/555').expect(404);
    });
    
  })
  
  describe('ComprasController', () => { 
    it('can POST order, GET the post one', async () => {
      const produto = {
        nome: "mockNome",
        descricao: "mockDescricao",
        preco: 22.22,
        fotos: ["mockLink"]
      }
      let data = await request(app.getHttpServer())
      .post('/produto')
      .send(produto)
      .expect(201);
  
      expect(data.body).toEqual({
        nome: produto.nome,
        descricao: produto.descricao,
        preco: produto.preco,
        fotos: [
          {
            linkFoto: produto.fotos[0],
            id: expect.any(Number)
          }
        ],
        id: expect.any(Number),
      });


      const mockOrder = {
        cliente: {
          nome: "mockNome",
          telefone: "mockTelefone",
          email: "mockEmail",
          endereco: "mockEndereço"
        },
        pagamento: {
          bandeira: "master",
          numero: "0000.0000.0000.0001",
          validade: "05/2028",
          cvv:"555",
          titular: "JOAO DA SILVA"
        },
        produtos: [data.body.id],
        valorTotal: 23.57
      }
  
      data = await request(app.getHttpServer()).post('/compras').send(mockOrder).expect(201);
      expect(data.body).toEqual({
        message: 'Operação realizada com sucesso', 
        code: expect.any(String)
      });
      data = await request(app.getHttpServer()).get(`/compras/${data.body.code}/`).expect(200);
      
      expect(data.body).toEqual({
        valor: 23.57,
        status: expect.any(String)
      });
    });
    it('cannot POST with invalid products', async () => {
      const mockOrder = {
        cliente: {
          nome: "mockNome",
          telefone: "mockTelefone",
          email: "mockEmail",
          endereco: "mockEndereço"
        },
        pagamento: {
          bandeira: "master",
          numero: "0000.0000.0000.0001",
          validade: "05/2028",
          cvv:"555",
          titular: "JOAO DA SILVA"
        },
        produtos: [56],
        valorTotal: 23.57
      }
      await request(app.getHttpServer()).post('/compras').send(mockOrder).expect(404);
    });
  })
});


