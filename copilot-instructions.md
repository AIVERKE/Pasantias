# Copilot Instructions: Pasantías Internship Management System

This is a fullstack application for managing academic internships (pasantías). The codebase is organized as a monorepo with independent backend and frontend applications that share architectural patterns and a unified design system.

---

## Quick Start: Build & Test Commands

### Backend (pasantias-backend/)
- **Dev server with watch:** `npm run start:dev`
- **Build:** `npm run build`
- **Run production build:** `npm run start:prod`
- **Run single test file:** `npm test -- <path/to/file.spec.ts>`
- **Run all tests:** `npm test`
- **Run tests in watch mode:** `npm run test:watch`
- **Check coverage:** `npm run test:cov`
- **Lint & fix issues:** `npm run lint`
- **Format code:** `npm run format`

### Database Migrations (Backend)
- **Run pending migrations:** `npm run migration:run`
- **Generate new migration after entity changes:** `npm run migration:generate -- src/migrations/DescriptiveName`
- **Revert last migration:** `npm run migration:revert`
- **Access TypeORM CLI directly:** `npm run typeorm -- <command>`
- **Seed database:** `npm run seed`

### Frontend (pasantias-frontend/)
- **Dev server with HMR:** `npm run dev`
- **Build for production:** `npm run build`
- **Preview production build:** `npm run preview`

---

## Environment Setup

### Backend Prerequisites
1. **PostgreSQL** running locally on `localhost:5432`
2. Create database: `CREATE DATABASE pasantias_db;` (or use PgAdmin)
3. Configure `.env` in `pasantias-backend/`:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=pasantias_user
   DB_PASSWORD=pasantias_password
   DB_DATABASE=pasantias_db
   ```
4. Run migrations: `npm run migration:run`

### Frontend Prerequisites
- No external services required; communicates with backend API at `http://localhost:3000` (by default)

---

## Architecture Overview

### Backend: Modular NestJS + TypeORM

**Modular Structure:** Each domain (usuarios, pasantias, empresas, etc.) is an independent NestJS module:
```
src/
├── auth/                    # JWT + Passport strategies (local + jwt)
├── usuarios/                # Base User model + inheritance subtypes
├── estudiantes/             # Inherits from Usuario
├── empresas/                # Company management
├── pasantias/               # Internship postings & records
├── inscripciones/           # Student applications to internships
├── actividades/             # Tasks/activities during internship
├── comentarios/             # Comments on internships
├── documentos/              # Bitácora, Final Report, Resume, Skills
├── roles/                   # Role definitions (Estudiante, Tutor, Gerente, JefePasantes, etc.)
├── config/                  # TypeORM data-source configuration
├── database/                # Seeders
└── migrations/              # TypeORM migration files
```

**Entity Relationships & Patterns:**

1. **User Inheritance (Single-Table):** The `Usuario` entity uses TypeORM single-table inheritance:
   - `Usuario` (base): id, email, password, created_at
   - `Estudiante`, `Tutor`, `Gerente`, `JefePasantes`, `SuperUsuario` inherit from `Usuario`
   - Each subtype has its own PK (e.g., `id_estudiante`) which is also an FK to `Usuario.id`
   - Use `@ChildEntity()` decorator and `type` discriminator column

2. **Modular Services:** Each module exports a service with core business logic; controllers delegate to services.

3. **Auth:** JWT tokens issued on login; Passport guards enforce role-based access (see `auth/guards/`).

### Frontend: Vue 3 SPA with Role-Based UI

**File Structure:**
```
src/
├── components/              # Reusable UI components (forms, tables, panels)
├── views/                   # Role-specific pages (StudentDashboard, TutorDashboard, etc.)
├── stores/                  # Pinia state (auth, user, entities)
├── router/                  # Vue Router with role-based guards
├── api/                     # Axios client functions (calls backend endpoints)
├── layouts/                 # Page layouts (sidebar + content area)
├── plugins/                 # Vuetify, Tailwind registration
└── App.vue
```

**Role-Based Views:** The system has 6 roles with distinct menus and pages:
- **Estudiante (Student):** Dashboard, browse internships, my applications, logbook, resume, final report
- **Tutor (Academic Advisor):** Dashboard, my students, student progress tracking
- **JefePasantes (Internship Lead):** Dashboard, applications, intern list, logbooks, final reports, activities
- **Gerente (Manager/Company):** Dashboard, company profile, internship postings, team management, active interns
- **SuperUsuario (Admin):** Global dashboard, user management, company approval, internship catalog

---

## Design System: Scholar Core

The frontend uses a unified design token system called **Scholar Core**. Use these tokens consistently:

### Colors
| Role/Context | Color | Hex |
|---|---|---|
| Primary (actions, links, active states) | Blue | #3B82F6 |
| Secondary (sidebars, backgrounds) | Dark Navy | #1A2233 |
| Tertiary (warnings, alerts) | Amber | #D16900 |
| Neutral (page background) | Light Gray | #F3F4F6 |
| Surface (cards, modals, forms) | White | #FFFFFF |
| Success (approved, completed) | Green | #10B981 |
| Danger (rejected, alerts) | Red | #EF4444 |

### Typography
- **Titles & Large Numbers:** Manrope 600–700 weight
- **Body Text & Labels:** Inter 400–500 weight

### Spacing & Layout
- **Grid:** 8px multiples (8px, 16px, 24px, 32px)
- **Border Radius:** 12px for cards/modals, 8px for small UI elements
- **Shadows:** Subtle, avoid heavy shadows or gradients

### Component Patterns

**Tables:** Every column has an inline filter field below the header (except Actions column).

**Sidebars:** 480px wide (600px for internship detail with comments), slide in from right with 200ms ease, white background with left shadow.

**Modals:** Centered on dark semi-transparent background, white card (12px radius), max 2 actions (primary blue + ghost cancel).

**Stat Cards:** 4px left border (blue for student/tutor, amber for internship lead, green for manager, navy for admin); number in Manrope 32px 700, subtitle in Inter 12px gray.

---

## Key Conventions

### Backend: NestJS Module Pattern

Each module follows this structure:
```
module-name/
├── module-name.module.ts        # Declares controller, service, entities
├── module-name.controller.ts    # Handles HTTP requests
├── module-name.service.ts       # Business logic
├── module-name.spec.ts          # Unit tests
├── entities/
│   └── entity-name.entity.ts    # TypeORM entities
├── dto/
│   ├── create-*.dto.ts          # Create request DTOs
│   └── update-*.dto.ts          # Update request DTOs
└── [optional] strategies/       # Auth strategies (in auth module)
```

**DTO Validation:** Use `class-validator` decorators (`@IsEmail()`, `@IsNotEmpty()`, etc.) for automatic validation.

**Entity Decorators:**
- `@Entity()` for table definition
- `@PrimaryGeneratedColumn('uuid')` for auto-increment IDs
- `@Column()` for fields
- `@ManyToOne()`, `@OneToMany()`, `@ManyToMany()` for relationships
- `@ChildEntity()` for inheritance subtypes

### Frontend: Component & Store Conventions

**Component Naming:**
- Pages (views): `StudentDashboard.vue`, `TutorDashboard.vue`, etc.
- Reusable components: `DataTable.vue`, `SidePanel.vue`, `StatCard.vue`, etc.
- Follow PascalCase for Vue components

**Pinia Store Pattern:**
```typescript
export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const token = ref(null);
  const login = async (email, password) => { /* ... */ };
  const logout = () => { /* ... */ };
  return { user, token, login, logout };
});
```

**API Client:** Create utility functions in `src/api/` that wrap Axios calls and handle errors consistently.

**Router Guards:** Use route meta to enforce role-based access:
```typescript
{ path: '/tutor-dashboard', component: TutorDashboard, meta: { requiredRoles: ['Tutor'] } }
```

### Auth Flow

**Backend:**
1. Login endpoint (`POST /auth/login`) accepts email + password
2. Validates credentials against `Usuario` table
3. Returns JWT token (signed with secret in `.env`)
4. Guards (`JwtAuthGuard`, `RolesGuard`) verify token and authorize endpoints

**Frontend:**
1. Login form captures email + password
2. Calls `POST /auth/login`
3. Stores token in Pinia auth store (and optionally localStorage)
4. Attaches token to all Axios requests via `Authorization: Bearer <token>`
5. Guards check token validity before routing to protected pages

---

## Testing

### Backend: Jest

**Unit Tests:** Test services in isolation using mocks.
```bash
npm run test                      # Run all *.spec.ts files
npm run test -- auth.service     # Run specific test file
npm run test -- --watch          # Watch mode
npm run test:cov                 # Coverage report
```

**E2E Tests:** Test full flow from HTTP request to database.
```bash
npm run test:e2e
```
E2E config is in `test/jest-e2e.json`; tests are in `test/` directory.

**Test File Naming:** `*.spec.ts` (automatically discovered by Jest)

**Mocking:** Use `jest.mock()` or `@nestjs/testing` utilities:
```typescript
const module = await Test.createTestingModule({
  providers: [MyService, { provide: Repository, useValue: mockRepository }],
}).compile();
```

---

## Common Tasks

### Adding a New Entity

1. **Create entity file:** `src/module-name/entities/entity-name.entity.ts`
   - Use `@Entity()`, `@Column()`, `@PrimaryGeneratedColumn()` decorators
   - Define relationships (`@ManyToOne()`, etc.)

2. **Create DTOs:** `src/module-name/dto/create-*.dto.ts` and `update-*.dto.ts`
   - Use `class-validator` decorators for validation

3. **Export in module:** Add entity to `TypeOrmModule.forFeature([YourEntity])` in the module

4. **Generate migration:** `npm run migration:generate -- src/migrations/AddEntityName`
   - Review generated migration in `src/migrations/`
   - Run: `npm run migration:run`

5. **Create service & controller:** Follow the module pattern above

### Adding a Role-Restricted Endpoint

1. **Backend (NestJS):**
   ```typescript
   @UseGuards(JwtAuthGuard, RolesGuard)
   @Roles('Tutor', 'JefePasantes')  // Restrict to specific roles
   @Get('/example')
   getExample() { /* ... */ }
   ```

2. **Frontend (Vue):**
   - Add route guard in router config
   - Conditionally render components based on `useAuthStore().user.role`

### Extending the Design System

If new colors or components are needed:
1. Update token values in Vuetify theme config (`src/plugins/vuetify.js` or similar)
2. Document changes in this file (Scholar Core section)
3. Use Tailwind classes for layout (`p-6`, `grid-cols-3`, etc.) and Vuetify components for UI

---

## Tips for Working Effectively

- **Backend development:** Keep migrations in version control; never modify old migrations—generate new ones.
- **Frontend development:** Use Vue DevTools browser extension to inspect Pinia state and component hierarchy.
- **Testing:** Write tests as you add features; maintain >80% coverage for critical paths (auth, entity creation).
- **Design consistency:** Always use Scholar Core tokens; avoid hardcoding colors or sizes.
- **API contracts:** Define DTOs first; they serve as documentation for frontend-backend communication.
- **Database schema:** Consult the README.md in `pasantias-backend/` for entity relationship diagrams if needed.

---

## Useful References

- **NestJS Docs:** https://docs.nestjs.com
- **TypeORM Docs:** https://typeorm.io
- **Vue 3 Docs:** https://vuejs.org
- **Vuetify Docs:** https://vuetifyjs.com
- **Pinia Docs:** https://pinia.vuejs.org
- **Passport.js Docs:** https://www.passportjs.org

---

**Last Updated:** May 2026  
**System:** Pasantías Internship Management System (UMSA)
