import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';

const jwtServiceMock = {
  signAsync: jest.fn(),
};

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('getToken', () => {
    it('should generate an access token', async () => {
      const mockAccessToken = 'mock-access-token';
      jwtServiceMock.signAsync.mockResolvedValue(mockAccessToken);

      const username = 'testuser';
      const result = await authService.getToken(username);

      expect(result).toEqual({ access_token: mockAccessToken });
      expect(jwtServiceMock.signAsync).toHaveBeenCalledWith({ username });
    });
  });
});
