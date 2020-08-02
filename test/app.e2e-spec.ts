import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpService, HttpModule } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('ProdutosController (e2e)', () => {
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
    return expect(data.body).toEqual({
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
    
  })

});
