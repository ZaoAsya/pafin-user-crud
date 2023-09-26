import { User } from '../src/routes/users/entities/user.entity';

export const notExistedUserId: string = 'aaa7777a-a777-7a77-777a-777777aa77aa';
export const mockUser: User = {
  id: 'eca4677d-a115-4d36-812c-527797ee57ab',
  name: 'test1',
  email: 'test@test.ru',
  password: 'test',
};
export const mockUserList: User[] = [
  mockUser,
  {
    id: 'aaa6666a-a666-6a66-666a-666666aa66aa',
    name: 'test2',
    email: 'test@test.ru',
    password: 'test',
  },
];
export const mockAuthHeader =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InN0cmluZyIsImlhdCI6MTY5NTcxOTU4NiwiZXhwIjoxNjk1NzI2Nzg2fQ.ks7shq3zFya6rOe6SvvElre_BhBs5Ny8HX4ziXvXqKo';
