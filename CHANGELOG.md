# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Migration package for independent member center project

---

## [2.0.0] - 2026-01-14

### Added - Member Module Architecture

#### New Module Structure (`src/modules/member/`)
- **types/index.ts**: Centralized type definitions for Profile, Entitlement, Product, Plan, etc.
- **context/MemberContext.tsx**: Authentication context provider with useMember hook
- **hooks/useEntitlements.ts**: Entitlement-related hooks (useProducts, useMyEntitlements, useProductAccess)
- **utils/validation.ts**: Zod-based form validation schemas for login/signup
- **components/**: Reusable member components
  - `MemberProtectedRoute.tsx`: Route protection component
  - `MemberCardSkeleton.tsx`: Loading skeleton component
  - `MemberLoginWidget.tsx`: Embeddable login widget
- **pages/**: Member-facing pages
  - `UnifiedAuthPage.tsx`: Login/signup page
  - `UnifiedDashboard.tsx`: Member dashboard
  - `UnifiedProfilePage.tsx`: Profile management
  - `OAuthAuthorizePage.tsx`: OAuth authorization flow

#### Migration Package (`docs/migration/`)
- **MEMBER_CENTER_MIGRATION.md**: Comprehensive migration guide
- **schema.sql**: Complete database schema for independent project
  - Core tables: profiles, user_roles, products, plans, entitlements, subscriptions
  - OAuth tables: oauth_clients, oauth_authorization_codes, oauth_access_tokens
  - Security tables: api_keys, rate_limits, ip_blacklist, admin_logs
  - All RLS policies and database functions
- **DATA_MIGRATION.md**: Step-by-step data migration instructions
- **config.toml.example**: Edge Functions configuration template
- **edge-functions/**: Production-ready Edge Functions
  - `check-entitlement.ts`: Unified entitlement verification
  - `entitlements-me.ts`: Current user entitlements
  - `entitlements-lookup.ts`: Admin lookup by email
  - `oauth-authorize.ts`: OAuth 2.0 authorization flow

#### NPM Package (`docs/sdk/member-login-widget/`)
- Complete NPM package structure for cross-project integration
- Supports ESM, CJS, and TypeScript declarations
- Includes MemberProvider, useMember hook, and MemberLoginWidget component

### Changed
- Refactored authentication logic from scattered files into centralized module
- Updated import paths with backward compatibility through bridge files
- README.md now includes complete architecture documentation (中英雙語)

### Deprecated
- Direct imports from `@/hooks/useMember` (use `@/modules/member` instead)
- Direct imports from `@/hooks/useEntitlements` (use `@/modules/member` instead)
- Direct imports from `@/components/MemberProtectedRoute` (use `@/modules/member` instead)

---

## [1.5.0] - 2026-01-10

### Added - Multi-Product Entitlements System
- Products table with support for multiple offerings
- Plans table for subscription tiers
- Entitlements table tracking user access with status (active/expired/revoked)
- External API endpoints for entitlement verification
- API Key authentication system for external projects

### Added - OAuth Provider System
- OAuth 2.0 authorization code flow
- OAuth clients management interface
- Access token generation and validation
- User-controlled authorized apps management

---

## [1.4.0] - 2026-01-05

### Added - Role-Based Access Control
- Helper role (小幫手) with limited operational authority
- Draft-and-approve workflow for helper modifications
- Pending changes table and approval system
- Admin logs for audit trail

---

## [1.3.0] - 2025-12-28

### Added - Member Dashboard
- Unified member dashboard with entitlement overview
- Profile management page
- Subscription history display
- Pull-to-refresh gesture support

---

## [1.2.0] - 2025-12-20

### Added - Customer Management System
- Customer profiles with birth details
- Customer tags and categorization
- Interaction tracking and follow-ups
- Batch operations support

---

## [1.1.0] - 2025-12-15

### Added - Document Management
- Document upload and parsing (DOCX support)
- Share link generation with password protection
- Print-to-PDF functionality
- Text-to-speech narration

---

## [1.0.0] - 2025-12-01

### Added - Initial Release
- Admin authentication system
- Basic document viewer
- Password-protected sharing
- Dual-brand ecosystem (超烜創意 & 虹靈御所)

---

## Migration Roadmap

### Phase 1: Foundation (Current)
- ✅ Modular architecture refactoring
- ✅ Migration package preparation
- ✅ Documentation completion

### Phase 2: Independent Project Setup
- [ ] Create new Lovable project for member center
- [ ] Deploy database schema
- [ ] Configure Edge Functions

### Phase 3: Data Migration
- [ ] Export user profiles and roles
- [ ] Export products and entitlements
- [ ] Validate data integrity

### Phase 4: Integration
- [ ] Update main site to use member center API
- [ ] Configure OAuth for cross-project auth
- [ ] Deploy NPM package for widget integration

### Phase 5: Transition
- [ ] Parallel operation period
- [ ] Gradual traffic migration
- [ ] Decommission legacy code
