# Backend Analysis - Duck Eat API

> Detailed analysis of positive points, negative points, and improvement suggestions for scalability.

---

## Positive Points

### 1. Solid Architecture (Clean Architecture + DDD)

- **Clear layer separation**: `domain/`, `application/`, `infra/` in each module
- **Repository Pattern** well implemented with interfaces in domain and implementations in infra
- **Use Case Pattern** isolating business rules
- **Dependency Injection** manual but functional

### 2. Modern Tech Stack

- **Fastify 5.7** - high performance web framework
- **Prisma 7** - modern ORM with type-safety
- **Zod 4** - schema validation with type inference
- **TypeScript 5.9** - robust typing
- **Vitest** - fast and modern test framework

### 3. Authentication Security

- **Argon2** for password hashing (industry standard)
- **JWT** for stateless authentication
- **Parameterized queries** via Prisma (prevents SQL injection)

### 4. Code Quality

- **Biome** for consistent linting/formatting
- **Path aliases** (`@/*`) for clean imports
- **Environment validation** with Zod on startup
- **OpenAPI/Swagger** auto-generated with documentation

### 5. Testing Infrastructure

- **In-memory repositories** for isolated tests
- **Factories** for mock entity creation
- **Unit tests** in use cases

### 6. Database Design

- **Soft deletes** with `deletedAt` (preserves history)
- **UUID v7** (time-sortable, better index performance)
- **Timestamps** on all tables

---

## Negative Points and Risks

### 1. ~~CRITICAL: Credentials in Repository~~

- [x] `.env` is in `.gitignore` - credentials are NOT being sent to repository

### 2. Production Security

- [ ] JWT secret default is `"secret"` - extremely insecure for production
- [ ] Token expires in 10 minutes without refresh token
- [x] ~~No rate limiting~~ - **IMPLEMENTED** (`@fastify/rate-limit`)
- [x] ~~No CORS configured~~ - **IMPLEMENTED** (`@fastify/cors`)
- [x] ~~No helmet/HTTP headers protection~~ - **IMPLEMENTED** (`@fastify/helmet`)

### 3. Incomplete Authorization

- [ ] Roles system (`ADMIN`, `CLIENT`, `RESTAURANT_ADMIN`) exists but is not verified in controllers
- [ ] Any authenticated user can access any resource
- [ ] No verification if user owns the resource being modified

### 4. No Concurrency Handling

- [ ] No optimistic locking in transactions
- [ ] No database transactions in multi-table operations
- [ ] Possible race conditions

### 5. Logging and Monitoring Absent

- [ ] No structured logging system (only basic `console.log`)
- [ ] No performance metrics
- [ ] No distributed tracing
- [ ] Difficult to debug in production

### 6. Limited Scalability

- [ ] Basic connection pooling
- [ ] No caching (Redis)
- [ ] No queues for async processing
- [ ] Direct upload to S3 (blocking)

### 7. Incomplete Tests

- [ ] Only unit tests in use cases
- [ ] No integration tests (real database)
- [ ] No E2E tests (API endpoints)
- [ ] Coverage not documented

### 8. Manual Dependency Injection

```typescript
// Controllers manually create repositories
const useCase = new CreateProductUseCase(new PrismaProductRepository());
```

- [ ] Hard to mock in integration tests
- [ ] Unnecessary coupling

### 9. Error Handler Issues

```typescript
// server.ts lines 116-131 have inverted logic
if(err && err.statusCode === 429){
  return reply.code(409).send({  // Should be 429, not 409
    error: "Internal Server Error",  // Wrong message
    message: "Response doesn't match the schema",
    statusCode: 409,
  });
}

return reply.code(500).send({
  error: "Rate limit exceeded",  // This is in the wrong place
  message: "Rate limit exceeded",
  statusCode: 500,
});
```

- [ ] Rate limit error (429) returns wrong status code (409)
- [ ] Generic 500 error has wrong message ("Rate limit exceeded")

---

## Improvement Suggestions

### High Priority (Security)

#### 1. Credentials Protection

- [x] **DONE** - `.env` is already in `.gitignore`

#### 2. Implement Rate Limiting

- [x] **DONE** - Already implemented in `server.ts`

```typescript
app.register(fastifyRateLimit, {
  max: 100,
  timeWindow: "1 minute"
});
```

**Suggestion**: Add specific rate limit for auth routes:

```typescript
// In auth.routes.ts
app.register(fastifyRateLimit, {
  max: 5,
  timeWindow: '15 minutes',
});
```

#### 3. Implement CORS and Helmet

- [x] **DONE** - Already implemented in `server.ts`

```typescript
app.register(fastifyCors, {
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
});

app.register(fastifyHelmet);
```

**Suggestion**: Add allowed origins:

```typescript
app.register(fastifyCors, {
  origin: env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
});
```

#### 4. Fix Error Handler

- [ ] **TODO** - Fix the inverted error messages in `server.ts`

```typescript
// Correct implementation
if (err && err.statusCode === 429) {
  return reply.code(429).send({
    error: "Too Many Requests",
    message: "Rate limit exceeded. Please try again later.",
    statusCode: 429,
  });
}

console.error(err);

return reply.code(500).send({
  error: "Internal Server Error",
  message: "An unexpected error occurred",
  statusCode: 500,
});
```

#### 5. Implement Refresh Tokens

- [ ] **TODO**

```typescript
// Suggested structure
interface TokenPair {
  accessToken: string;   // Short (15 min)
  refreshToken: string;  // Long (7 days), stored in DB
}

// New Prisma table
model RefreshToken {
  id        String   @id @default(uuid(7))
  token     String   @unique
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  expiresAt DateTime
  createdAt DateTime @default(now())
}
```

---

### Medium Priority (Scalability)

#### 6. Implement Authorization System (RBAC/ABAC)

- [ ] **TODO**

```typescript
// src/http/plugins/authorization.ts
interface AuthorizationPolicy {
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete';
  condition: (user: AuthUser, resource: any) => boolean;
}

const policies: AuthorizationPolicy[] = [
  {
    resource: 'product',
    action: 'update',
    condition: (user, product) =>
      user.organizationId === product.organizationId
  }
];

// Guard decorator/hook
export function authorize(resource: string, action: string) {
  return async (request: FastifyRequest) => {
    const policy = policies.find(p =>
      p.resource === resource && p.action === action
    );
    if (!policy?.condition(request.user, request.body)) {
      throw new ForbiddenError('Access denied');
    }
  };
}
```

#### 7. Add DI Container (TSyringe or Awilix)

- [ ] **TODO**

```typescript
// pnpm add tsyringe reflect-metadata
import { container, injectable, inject } from 'tsyringe';

@injectable()
export class CreateProductUseCase {
  constructor(
    @inject('ProductRepository')
    private productRepository: ProductRepository
  ) {}
}

// Registration
container.register('ProductRepository', {
  useClass: PrismaProductRepository
});

// Simplified controller
const useCase = container.resolve(CreateProductUseCase);
```

#### 8. Implement Caching with Redis

- [ ] **TODO**

```typescript
// pnpm add ioredis
import Redis from 'ioredis';

const redis = new Redis(env.REDIS_URL);

// Cache decorator pattern
export class CachedProductRepository implements ProductRepository {
  constructor(
    private repository: ProductRepository,
    private cache: Redis
  ) {}

  async getProductById(id: string) {
    const cached = await this.cache.get(`product:${id}`);
    if (cached) return JSON.parse(cached);

    const product = await this.repository.getProductById(id);
    await this.cache.setex(`product:${id}`, 300, JSON.stringify(product));
    return product;
  }
}
```

#### 9. Implement Queue System (BullMQ)

- [ ] **TODO**

```typescript
// pnpm add bullmq
import { Queue, Worker } from 'bullmq';

// For async image uploads
const imageQueue = new Queue('image-processing');

// Producer (controller)
await imageQueue.add('resize', {
  key: uploadedFile.key,
  sizes: ['thumbnail', 'medium', 'large']
});

// Consumer (separate worker)
new Worker('image-processing', async (job) => {
  await processImage(job.data.key, job.data.sizes);
});
```

#### 10. Add Structured Logging (Pino)

- [ ] **TODO**

```typescript
// Fastify already uses Pino, just configure it
const app = fastify({
  logger: {
    level: env.LOG_LEVEL || 'info',
    transport: env.NODE_ENV === 'development'
      ? { target: 'pino-pretty' }
      : undefined,
    serializers: {
      req: (req) => ({
        method: req.method,
        url: req.url,
        userId: req.user?.userId
      })
    }
  }
});

// In use cases
logger.info({ productId, organizationId }, 'Product created');
```

---

### Low Priority (Quality)

#### 11. Integration Tests

- [ ] **TODO**

```typescript
// src/test/integration/product.spec.ts
import { createTestApp } from '../helpers/test-app';

describe('Product API', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await createTestApp(); // With real test database
  });

  test('POST /api/v1/product/new creates product', async () => {
    const token = await getAuthToken(app);

    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/product/new',
      headers: { Authorization: `Bearer ${token}` },
      payload: { name: 'Pizza', price: 2500 }
    });

    expect(response.statusCode).toBe(201);
    expect(response.json()).toMatchObject({
      id: expect.any(String),
      name: 'Pizza'
    });
  });
});
```

#### 12. Database Transactions

- [ ] **TODO**

```typescript
// src/lib/db/transaction.ts
import { prisma } from './prisma';

export async function withTransaction<T>(
  fn: (tx: Prisma.TransactionClient) => Promise<T>
): Promise<T> {
  return prisma.$transaction(fn, {
    maxWait: 5000,
    timeout: 10000,
    isolationLevel: 'Serializable'
  });
}

// Usage in use case
async execute(data: CreateOrderInput) {
  return withTransaction(async (tx) => {
    const order = await tx.order.create({ data });
    await tx.stock.decrement({ where: { productId: data.productId } });
    return order;
  });
}
```

#### 13. Health Checks and Graceful Shutdown

- [ ] **TODO**

```typescript
// Health check endpoint
app.get('/health', async () => ({
  status: 'healthy',
  timestamp: new Date().toISOString(),
  database: await checkDatabaseConnection(),
  redis: await checkRedisConnection()
}));

// Graceful shutdown
const signals = ['SIGTERM', 'SIGINT'];
for (const signal of signals) {
  process.on(signal, async () => {
    app.log.info(`${signal} received, shutting down...`);
    await app.close();
    await prisma.$disconnect();
    process.exit(0);
  });
}
```

---

## Roadmap to Scale

| Phase | Focus | Items | Status |
|-------|-------|-------|--------|
| **1** | Security | ~~Remove credentials~~, ~~Rate limiting~~, ~~CORS~~, ~~Helmet~~, Refresh tokens | 80% |
| **2** | Authorization | RBAC, Resource ownership verification | 0% |
| **3** | Observability | Structured logging, Health checks, Metrics | 0% |
| **4** | Performance | Redis cache, Optimized connection pooling | 0% |
| **5** | Scalability | Queues (BullMQ), Async upload, CDN for images | 0% |
| **6** | Quality | E2E tests, CI/CD pipeline, Coverage > 80% | 0% |

---

## Suggested Folder Structure (Updated)

```
src/
├── modules/
│   └── {module}/
│       ├── domain/
│       │   ├── entities/          # Add domain entities
│       │   ├── repositories/
│       │   └── events/            # Domain events (new)
│       ├── application/
│       │   ├── use-cases/
│       │   ├── dto/
│       │   ├── policies/          # Authorization policies (new)
│       │   └── error/
│       └── infra/
│           ├── db/
│           ├── http/
│           └── cache/             # Redis implementations (new)
├── shared/                        # Shared code (new)
│   ├── domain/
│   │   └── events/
│   ├── infra/
│   │   ├── cache/
│   │   ├── queue/
│   │   └── logging/
│   └── application/
│       └── middlewares/
├── container/                     # DI container config (new)
└── config/                        # Centralized configurations (new)
```

---

## Summary

### Already Implemented

- [x] `.env` protected in `.gitignore`
- [x] Rate limiting with `@fastify/rate-limit`
- [x] CORS with `@fastify/cors`
- [x] Helmet with `@fastify/helmet`
- [x] Clean Architecture + DDD
- [x] Argon2 password hashing
- [x] JWT authentication
- [x] Zod validation
- [x] OpenAPI documentation

### Next Steps (Priority Order)

1. [ ] Fix error handler (inverted messages)
2. [ ] Implement refresh tokens
3. [ ] Add authorization (RBAC)
4. [ ] Configure structured logging
5. [ ] Add health checks
6. [ ] Implement integration tests

---

The backend has a **solid architectural foundation**. The main gaps are in **operational security** (refresh tokens, authorization) and **observability infrastructure** (logging, metrics).

With these improvements, the system will be ready to scale to thousands of users safely and observably.