export interface JwtService {
	sign(payload: Record<string, string>, options: { expiresIn: string }): string;
}
