import { Test } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';
import { UsersService } from '../src/routes/users/users.service';
import { UsersModule } from '../src/routes/users/users.module';
import { AuthModule } from '../src/routes/auth/auth.module';

import { UserNotFoundInterceptor } from '../src/interceptors/userNotFound.interceptor';
import { AuthGuard } from '../src/guards/auth.guard';

import { CreateUserDto } from '../src/routes/users/dto/createUser.dto';
import { UpdateUserDto } from '../src/routes/users/dto/updateUser.dto';
import {
  mockAuthHeader,
  mockUser,
  notExistedUserId,
  mockUserList,
} from './constants';

import { MockAuthGuard } from '../src/guards/__mocks__/auth.guard.mock';
import { MockUserNotFoundInterceptor } from '../src/interceptors/__mocks__/userNotFound.interceptor.mock';

describe('Users', () => {
  let app: INestApplication;
  const usersService = {
    findAll: () => mockUserList,
    findOne: () => mockUser,
    createUser: (user: CreateUserDto) => user,
    updateUser: (id: string, user: UpdateUserDto) => user,
    deleteUser: () => mockUser,
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [UsersModule, AppModule, AuthModule],
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
    xit('if not authorized returns 401', async () => {
      await request(app.getHttpServer())
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
    xit('if not authorized returns 401', () => {
      return request(app.getHttpServer())
        .get(`/users/${mockUser.id}`)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    xit('if no such user returns 404', () => {
      console.log(notExistedUserId !== mockUser.id);
      return request(app.getHttpServer())
        .get(`/users/${notExistedUserId}`)
        .set('Authorization', mockAuthHeader)
        .expect(HttpStatus.NOT_FOUND);
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

    xit('if not authorized returns 401', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send(newUser)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    xit('if authorized and input values incorrect returns 400', () => {
      return request(app.getHttpServer())
        .post('/users')
        .set('Authorization', mockAuthHeader)
        .send({ ...newUser, email: 'wrong_email' })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('if authorized and input values is correct returns 201', () => {
      return request(app.getHttpServer())
        .post('/users')
        .set('Authorization', mockAuthHeader)
        .send(newUser)
        .expect(HttpStatus.CREATED)
        .expect(usersService.createUser(newUser));
    });
  });

  describe('/PUT users/:id', () => {
    const newUser: UpdateUserDto = {
      name: mockUser.name,
      password: 'newPassword',
    };

    xit('if not authorized returns 401', () => {
      return request(app.getHttpServer())
        .put(`/users/${mockUser.id}`)
        .send(newUser)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    xit('if authorized and user not found returns 404', () => {
      return request(app.getHttpServer())
        .put(`/users/${notExistedUserId}`)
        .set('Authorization', mockAuthHeader)
        .send(newUser)
        .expect(HttpStatus.NOT_FOUND);
    });

    xit('if authorized and input values incorrect returns 400', () => {
      return request(app.getHttpServer())
        .put(`/users/${mockUser.id}`)
        .set('Authorization', mockAuthHeader)
        .send({ ...newUser, email: 'wrong_email' })
        .expect(HttpStatus.BAD_REQUEST);
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
    xit('if not authorized returns 401', () => {
      return request(app.getHttpServer())
        .del(`/users/${mockUser.id}`)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    xit('if authorized and user not found returns 404', () => {
      return request(app.getHttpServer())
        .del(`/users/${notExistedUserId}`)
        .set('Authorization', mockAuthHeader)
        .expect(HttpStatus.NOT_FOUND);
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
