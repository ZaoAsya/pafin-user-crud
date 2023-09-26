import { Test } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';
import { UsersService } from '../src/routes/users/users.service';
import { UsersModule } from '../src/routes/users/users.module';

import { UserNotFoundInterceptor } from '../src/interceptors/userNotFound.interceptor';
import { AuthGuard } from '../src/guards/auth.guard';

import { CreateUserDto } from '../src/routes/users/dto/createUser.dto';
import { UpdateUserDto } from '../src/routes/users/dto/updateUser.dto';
import {
  MockAuthGuard,
  mockAuthHeader,
  mockUser,
  mockUserId,
  mockUserList,
  MockUserNotFoundInterceptor,
} from './constants';

describe('Users', () => {
  let app: INestApplication;
  const usersService = {
    findAll: () => mockUserList,
    findOne: () => mockUser,
    createUser: () => mockUser,
    updateUser: (id: string, user: UpdateUserDto) => user,
    deleteUser: () => mockUser,
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [UsersModule, AppModule],
    })
      .overrideProvider(UsersService)
      .useValue(usersService)
      .overrideInterceptor(UserNotFoundInterceptor)
      .useValue(MockUserNotFoundInterceptor)
      .overrideGuard(AuthGuard)
      .useValue(MockAuthGuard)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  describe(`/GET users`, () => {
    it('if not authorized returns 401', () => {
      return request(app.getHttpServer())
        .get('/users')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('if authorized returns 200 with data', () => {
      return request(app.getHttpServer())
        .get('/users')
        .set('Authorization', mockAuthHeader)
        .expect(HttpStatus.OK)
        .expect(usersService.findAll());
    });
  });

  describe('/GET users/:id', () => {
    it('if not authorized returns 401', () => {
      return request(app.getHttpServer())
        .get(`/users/${mockUser.id}`)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    xit('if no such user returns 404', () => {
      console.log(mockUserId !== mockUser.id);
      return request(app.getHttpServer())
        .get(`/users/${mockUserId}`)
        .set('Authorization', mockAuthHeader)
        .expect(HttpStatus.NOT_FOUND); // 200
    });

    it('if user id is not uuid returns 400', () => {
      return request(app.getHttpServer())
        .get(`/users/$incorrect-id`)
        .set('Authorization', mockAuthHeader)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('if user exists returns 200 with data', () => {
      return request(app.getHttpServer())
        .get(`/users/${mockUser.id}`)
        .set('Authorization', mockAuthHeader)
        .expect(HttpStatus.OK)
        .expect(usersService.findOne());
    });
  });

  describe('/POST users', () => {
    const newUser: CreateUserDto = {
      name: mockUser.name,
      email: mockUser.email,
      password: mockUser.password,
    };

    it('if not authorized returns 401', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send(newUser)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('if authorized and input values incorrect returns 400', () => {
      return request(app.getHttpServer())
        .post('/users')
        .set('Authorization', mockAuthHeader)
        .send({ ...newUser, email: 'wrong_email' })
        .expect(HttpStatus.BAD_REQUEST); // 201
    });

    it('if authorized and input values is correct returns 201', () => {
      return request(app.getHttpServer())
        .post('/users')
        .set('Authorization', mockAuthHeader)
        .send(newUser)
        .expect(HttpStatus.CREATED);
    });
  });

  describe('/PUT users/:id', () => {
    const newUser: UpdateUserDto = {
      name: mockUser.name,
      password: 'newPassword',
    };

    it('if not authorized returns 401', () => {
      return request(app.getHttpServer())
        .put(`/users/${mockUser.id}`)
        .send(newUser)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('if authorized and user not found returns 404', () => {
      return request(app.getHttpServer())
        .put(`/users/${mockUserId}`)
        .set('Authorization', mockAuthHeader)
        .send(newUser)
        .expect(HttpStatus.NOT_FOUND); // 200
    });

    it('if authorized and input values incorrect returns 400', () => {
      return request(app.getHttpServer())
        .put(`/users/${mockUser.id}`)
        .set('Authorization', mockAuthHeader)
        .send({ ...newUser, email: 'wrong_email' })
        .expect(HttpStatus.BAD_REQUEST); // 200
    });

    it('if authorized and input values correct returns 200', () => {
      return request(app.getHttpServer())
        .put(`/users/${mockUser.id}`)
        .set('Authorization', mockAuthHeader)
        .send(newUser)
        .expect(HttpStatus.OK);
    });
  });

  describe('/DELETE users/:id', () => {
    it('if not authorized returns 401', () => {
      return request(app.getHttpServer())
        .del(`/users/${mockUser.id}`)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('if authorized and user not found returns 404', () => {
      return request(app.getHttpServer())
        .del(`/users/${mockUserId}`)
        .set('Authorization', mockAuthHeader)
        .expect(HttpStatus.NOT_FOUND); // 200
    });

    it('if authorized returns 200', () => {
      return request(app.getHttpServer())
        .del(`/users/${mockUser.id}`)
        .set('Authorization', mockAuthHeader)
        .expect(HttpStatus.OK);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
