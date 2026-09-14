## What this changes

## Why

<!-- The reason, if it is not obvious from the diff. -->

## Checks

- [ ] `pnpm check` passes (typecheck, lint, unit tests)
- [ ] `pnpm build` passes
- [ ] Integration tests pass, if this touches data or access (`pnpm test:int`)
- [ ] Checked at **390px**, not only desktop

## Schema and content

- [ ] No schema change
- [ ] Schema change, with a committed migration whose SQL I have read
- [ ] `pnpm generate:types` run and the result committed

If there is a migration, what does `down()` drop?

## Access control

- [ ] Does not touch access rules
- [ ] Touches access rules, and `tests/int/roles.int.spec.ts` covers the change

## Test isolation

- [ ] Adds no test that writes to real content
- [ ] Writes to real content, and captures and restores the original in the test **and**
      in `afterAll`

## Evidence

<!-- Screenshots for anything visual. Phone width first. -->
