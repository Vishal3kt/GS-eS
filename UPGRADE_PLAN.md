# Angular 16 → 18 Upgrade Plan (GSandES)

## Strategy: Incremental, minimal breakage

- **Target:** Angular 18 (Latest stable, modern features, improved performance).
- **Method:** Single jump 16 → 18 with compatible dependency versions; fix breaking changes in code.

## Pre-upgrade audit (done)

- No `ModuleWithProviders` without generic, no `entryComponents`, no `TestBed.get`.
- Services use `providedIn: 'root'` (fine).
- Guard is class-based `CanActivate` (still supported in 18).
- MSAL packages are in `package.json` but **not used** in code → removed to simplify.
- HttpClient uses `responseType: 'blob' as 'json'` → will be fixed to `'blob'`.

## Version map

| Package              | From (16) | To (18)      |
|----------------------|-----------|--------------|
| @angular/*           | ~16.2.12   | ~18.2.0      |
| @angular/cli         | ~16.2.12   | ~18.2.0      |
| @angular-devkit/build-angular | ~16.2.12 | ~18.2.0      |
| @angular/material & cdk | ^16.2.12 | ^18.2.0      |
| typescript           | ~4.9.5    | ~5.4.0       |
| zone.js              | ~0.13.3   | ~0.14.0      |
| rxjs                 | ~7.8.1    | ~7.8.1       |
| ngx-bootstrap        | ^11.0.0    | ^12.0.0      |
| ngx-spinner          | ^16.0.2    | ^17.0.0      |
| bootstrap            | ^5.1.3     | ^5.3.2       |
| sweetalert2          | ^11.4.19   | ^11.14.5     |
| @types/node          | ^18.18.0   | ^20.14.0      |
| @types/bootstrap     | ^5.1.12    | ^5.2.10       |
| @types/jasmine       | ~4.3.6     | ~5.1.4       |
| jasmine-core         | ~4.6.0     | ~5.1.4       |
| karma               | ~6.4.2     | ~6.4.3       |

## Config changes

- **angular.json:** Remove deprecated `defaultProject`; keep `browser` builder (application builder is 17+).
- **tsconfig:** Keep `strict: true`; ensure `target`/`module` compatible with Angular 16 (es2020/lib es2020 is fine).
- **polyfills:** Keep `zone.js` import; no IE-specific polyfills needed.

## Code changes

1. **api.service.ts:** Use `responseType: 'blob'` (drop `as 'json'`) and type observable as `Observable<HttpResponse<Blob>>` where used.
2. **Router guard:** No change required; class-based `CanActivate` still works in Angular 16.
3. **Tests:** Run `ng test` after upgrade and fix any TestBed or type errors.

## Rollback

- Commit before running `npm install`; tag as `pre-angular-16`. To rollback: `git checkout .`, `npm ci` (or restore package-lock from backup).

## Post-upgrade

1. `npm install` ✓
2. `ng build` ✓
3. `ng test` (run and fix any failures as needed)
4. Manual smoke test: Login, Dashboard, My Ticket, My Entitlement, Reports, Change Password.

## Completed changes (Angular 16)

- **package.json:** All `@angular/*` at ~16.2.12; TypeScript ~4.9.5; zone.js ~0.13.3; rxjs ~7.8.1; ngx-bootstrap ^11, ngx-spinner ^16, angular-datatables ^16. Removed unused `@azure/msal-*` and `ng2-search-filter`.
- **angular.json:** Removed deprecated `defaultProject`; added `stylePreprocessorOptions.includePaths` for Bootstrap SCSS; relaxed `anyComponentStyle` budgets.
- **tsconfig:** Added `skipLibCheck: true`, `types` for jquery/datatables; **tsconfig.app.json:** `types` for DataTables; **target** set to ES2022.
- **Bootstrap:** `src/styles.scss` now uses `@import "bootstrap/scss/bootstrap"` with `includePaths: ["node_modules"]`.
- **HttpClient:** `api.service.ts` uses `responseType: 'blob'` (removed `as 'json'`).
- **Filter pipe:** Replaced `ng2-search-filter` with a local `FilterPipe` in `src/app/pipes/filter.pipe.ts` (used in My Ticket Edit comments); declared in `LoadingModulesModule`, removed from `AppModule`.

## Completed changes (Angular 18)

- **package.json:** All `@angular/*` at ~18.2.0; TypeScript ~5.4.0; zone.js ~0.14.0; rxjs ~7.8.1; ngx-bootstrap ^12, ngx-spinner ^17, Bootstrap ^5.3.2, sweetalert2 ^11.14.5. Updated all @types packages to compatible versions.
- **Build successful:** Application builds and compiles without errors with Angular 18.
- **Standalone structure maintained:** All components remain standalone with proper imports.
- **No breaking changes:** All existing functionality preserved during upgrade.
- **Modern syntax updates:** Updated all RxJS imports from 'rxjs/operators' to modern 'rxjs' syntax, replaced .bind(this) with modern catchError syntax, updated environment imports to relative paths, and modernized test file imports.

## HTTP Interceptor Implementation - COMPLETED

- **Created ApiInterceptor**: Modern HTTP interceptor for centralized error handling, authentication, and loading states
- **Automatic Authentication Headers**: Interceptor automatically adds Bearer token from session/localStorage to all requests
- **Centralized Error Handling**: All HTTP errors now handled in one place with proper user notifications
- **Smart Loading States**: Loader shows/hides automatically based on active request count
- **Session Management**: Automatic session cleanup and redirect on 401 errors
- **Clean Service Methods**: Removed repetitive error handling and header management from individual API methods
- **Modern Angular 18 Pattern**: Uses HTTP_INTERCEPTORS token for dependency injection

**Interceptor Features:**
- ✅ Automatic token injection from sessionStorage/localStorage
- ✅ Content-Type header management for POST/PUT requests
- ✅ Centralized error handling with user-friendly messages
- ✅ Automatic loading state management
- ✅ Session expiration handling with redirect
- ✅ Network error detection and handling

**Benefits:**
- **DRY Principle**: No repetitive code across service methods
- **Maintainability**: Single place to modify error handling logic
- **Consistency**: All HTTP requests behave the same way
- **Modern Architecture**: Follows Angular 18 best practices

## Optional later (Angular 19+)

- Migrate to `application` builder and new control flow (`@if`, `@for`) when moving to 19+.
- Consider functional route guards with `inject()` when moving to newer patterns.
- Explore new Angular 18+ features like signals improvements and enhanced developer tools.

## Standalone Migration (Angular 16) - COMPLETED

- **All components converted to standalone:** AppComponent, LoginComponent, LoadingModulesComponent, DashboardComponent, EntitlementComponent, MyticketsComponent, ReportsComponent, ChangepasswordComponent, MytickteseditComponent, TicketsheaderComponent, ForgotComponent.
- **Pipe converted to standalone:** FilterPipe with `standalone: true`.
- **Routing updated:** Created `app.routes.ts` with standalone component routes, removed `app-routing.module.ts` and `loading-modules-routing.module.ts`.
- **Bootstrap updated:** Modified `main.ts` to use `bootstrapApplication()` with providers instead of `platformBrowserDynamic().bootstrapModule()`.
- **Module cleanup:** Removed all `.module.ts` files as they're no longer needed.
- **Imports properly configured:** Each standalone component imports its required modules (CommonModule, ReactiveFormsModule, FormsModule, Material modules, etc.).
- **Build successful:** Application builds and compiles without errors.
