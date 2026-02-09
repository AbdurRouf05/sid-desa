# Lint Analysis Report

## Summary
After excluding the `scripts/` directory and fixing `tailwind.config.ts`, there remain approximately 185 linting issues across the codebase.

## Breakdown by Type

### 1. `no-explicit-any` (High Frequency)
**Description:** Using `any` bypasses TypeScript's type checking.
**Locations:**
- `components/seo/json-ld.tsx`
- `lib/cdn.ts`
- `lib/config.ts`
- `lib/pb.ts`
**Recommendation:** Replace `any` with specific types or `unknown` where appropriate to improve type safety.

### 2. `no-unused-vars` (Medium Frequency)
**Description:** Variables defined but not used.
**Locations:**
- `components/ui/button.tsx`
- `lib/image-optimizer.ts`
- `middleware.ts`
**Recommendation:** Remove unused variables or prefix with `_` if they must be kept (e.g., function parameters).

### 3. `no-empty-object-type` (Low Frequency)
**Description:** Interfaces with no members.
**Locations:**
- `components/ui/command.tsx`
**Recommendation:** Remove empty interfaces or add necessary members.

## Next Steps
- **Immediate:** Fix `no-unused-vars` as they are safe to remove.
- **Long-term:** Gradually replace `any` with proper types during feature development to improve codebase stability.
