import { JwtService } from "@/modules/auth/domain/types/jwt-service";

export class FakeJwtService implements JwtService {
	sign(
		payload: Record<string, string>,
		options: { expiresIn: string },
	): string {
		return `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5YzYwYjM1Ny03MzZhLTQ4ZmEtYjYwOS1mNzM0MGJjMzMzMDYiLCJvcmdhbml6YXRpb25JZCI6IjFlMTZmNDk3LWY1MmYtNGZiZC1iNTA3LWNiZDY0MTdmOTE0MiIsImlhdCI6MTc3MDE2MTg4NywiZXhwIjoxNzcwMTYyNDg3fQ.9dxXfvyClPQtAHlZ6d9XiRdVEt2bOjBTyavPp9BQxPs`;
	}
}
