# Development Guidelines

## Code Modification Principles

### Never Change Existing Interfaces Without Discussion

**Critical Rule**: When modifying existing code, **NEVER** change function signatures, interfaces, or APIs without explicit discussion first.

#### What This Means:

- ✅ **DO**: Change the implementation inside a function
- ✅ **DO**: Add optional parameters with default values (if absolutely necessary, discuss first)
- ❌ **DON'T**: Change parameter types
- ❌ **DON'T**: Change parameter names
- ❌ **DON'T**: Make optional parameters required
- ❌ **DON'T**: Remove parameters
- ❌ **DON'T**: Change return types
- ❌ **DON'T**: Change object property names in interfaces

#### Example:

**WRONG** - Changing the interface:
```typescript
// Original
export function foo(options: { bar?: string }) { }

// WRONG - Changed interface
export function foo(options: { bar?: string, newProp: boolean }) { }
```

**CORRECT** - Changing implementation only:
```typescript
// Original
export function foo(options: { bar?: string }) {
    const value = options.bar || 'default';
}

// CORRECT - Implementation change only
export function foo(options: { bar?: string }) {
    const value = options.bar || getDefaultValue();
}
```

#### When You Need to Change an Interface:

1. **Stop** and ask for explicit approval
2. Explain why the interface change is necessary
3. Discuss alternatives that keep the interface intact
4. Only proceed after getting confirmation

### Rationale

Changing interfaces breaks:
- Existing callers of the function
- Tests that depend on the interface
- Documentation
- Backwards compatibility
- Other developers' expectations

It's almost always better to change implementation than interface.

## Other Guidelines

### Prefer Explicit Over Implicit

- Use clear, descriptive variable names
- Avoid magic values - use named constants
- Add comments for non-obvious logic

### Keep Functions Focused

- Each function should do one thing well
- If a function is getting complex, consider breaking it down
- Use helper functions liberally

### Error Handling

- Handle errors explicitly
- Provide meaningful error messages
- Don't silently swallow errors

### Testing

- Test behavior, not implementation
- Keep tests isolated and independent
- Use descriptive test names
