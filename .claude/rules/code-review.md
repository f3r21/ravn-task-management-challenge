---
name: code-review
description: Code review standards, comment freshness, strict TypeScript type checks, and static analysis rules.
---

# Code Review & Static Analysis Standards

## 1. Comment Accuracy & Freshness

- **Comments Explain Why:** High comment density is intentional. Ensure comments explain _why_ non-obvious code decisions exist.
- **Audit Stale Comments:** When modifying behavior, grep for comments describing the old behavior and update them immediately. Stale comments are critical defects.

## 2. TypeScript & Code Hygiene

- **Zero `any` / `@ts-ignore`:** Strictly forbidden. Use exact interface definitions or generic constraints.
- **No Barrel Files:** Components and utilities must be imported directly from their defining source file. Never create `index.ts` re-export barrels.
- **Error Handling:** Do not swallow errors or return empty dummy fallbacks without explicit log tracing.

## 3. Accessibility & DOM Assertions

- **Role Verification:** Disambiguate overlapping ARIA roles in tests.
- **Figma Design System:** Verify spacing, margins, typography, and `@theme` semantic tokens match Figma specs precisely.

## 4. Challenge Grading Constraints

- **Quality Over Quantity:** Do not rush feature delivery. The challenge explicitly grades on quality rather than completion. Perfect test coverage, strict types, and perfect accessibility always take priority over finishing the next feature.
