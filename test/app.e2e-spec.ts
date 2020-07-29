import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpService, HttpModule } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { of, async } from 'rxjs';

describe('ProdutosController (e2e)', () => {
  let app: INestApplication;
  let httpService: HttpService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, HttpModule],
      providers: []
    }).compile();

    app = moduleFixture.createNestApplication();
    httpService = moduleFixture.get<HttpService>(HttpService);
    await app.init();
  });

  it('/GET produto', async () => {
    const result = {
      data: { produtos: ['mockItem'], total: 1 },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    };

    jest.spyOn(httpService, 'get').mockImplementationOnce(() => of(result));
    const response = await request(app.getHttpServer()).get('/produto').expect(200)
  })

});
