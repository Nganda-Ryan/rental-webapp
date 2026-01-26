# Refactoring Quick Start Guide

## 🚀 Quick Wins (Start Here)

### 1. Consolidate Dashboard Pages (30 minutes)

**Problem:** `landlord/page.tsx` and `manager/page.tsx` are identical.

**Solution:**

#### Step 1: Create Shared Dashboard Component

```typescript
// src/components/feature/Dashboard/RoleDashboard.tsx
"use client"

import { useRoleStore } from "@/store/roleStore"
import { dashboard } from "@/actions/assetAction"
// ... other imports

interface RoleDashboardProps {
  role: "LANDLORD" | "MANAGER"
}

export function RoleDashboard({ role }: RoleDashboardProps) {
  const { user, getProfileCode } = roleStore()
  const profileCode = getProfileCode(role)
  
  // ... existing dashboard logic
  // Replace hardcoded "LANDLORD" with role prop
  
  return (
    // ... existing JSX
  )
}
```

#### Step 2: Update Landlord Page

```typescript
// src/app/(dashboard)/landlord/page.tsx
import { RoleDashboard } from "@/components/feature/Dashboard/RoleDashboard"

export default function Dashboard() {
  return <RoleDashboard role="LANDLORD" />
}
```

#### Step 3: Update Manager Page

```typescript
// src/app/(dashboard)/manager/page.tsx
import { RoleDashboard } from "@/components/feature/Dashboard/RoleDashboard"

export default function Dashboard() {
  return <RoleDashboard role="MANAGER" />
}
```

**Result:** Eliminates 197 lines of duplicate code.

---

### 2. Split Large Server Actions File (2-3 hours)

**Problem:** `assetAction.ts` is 642 lines with too many responsibilities.

**Solution:**

#### Step 1: Create New Action Files

```typescript
// src/actions/contractAction.ts
"use server"

import { verifySession } from "@/lib/session"
import { ActionResult } from "@/types/actions"

export async function createContract(
  data: IContractForm
): Promise<ActionResult<IContract>> {
  const session = await verifySession()
  if (!session) {
    return { success: false, error: 'Unauthorized' }
  }

  try {
    // Move contract creation logic here
    // ...
    return { success: true, data: contract }
  } catch (error) {
    console.error('Create contract error:', error)
    return { success: false, error: 'Failed to create contract' }
  }
}

// Similar for terminateLease, etc.
```

```typescript
// src/actions/invoiceAction.ts
"use server"

// Move all invoice-related functions here
export async function createInvoice(...)
export async function updateInvoice(...)
export async function searchInvoice(...)
```

```typescript
// src/actions/managerAction.ts
"use server"

// Move manager-related functions here
export async function inviteManager(...)
export async function cancelManagerInvitation(...)
```

#### Step 2: Update Imports

Use find/replace to update imports:
- `from "@/actions/assetAction"` → `from "@/actions/contractAction"`
- etc.

**Result:** Better organization, easier maintenance.

---

### 3. Standardize Error Handling (1-2 hours)

**Problem:** Inconsistent error return patterns.

**Solution:**

#### Step 1: Create Standard Types

```typescript
// src/types/actions.ts
export interface ActionResult<T = unknown> {
  success: boolean
  data?: T
  error?: string
  code?: number | string
}

export type ActionFunction<TParams, TReturn> = (
  params: TParams
) => Promise<ActionResult<TReturn>>
```

#### Step 2: Create Error Handler

```typescript
// src/lib/errorHandler.ts
import { ActionResult } from "@/types/actions"

export function handleActionError(
  error: unknown,
  context: string
): ActionResult {
  console.error(`[${context}] Error:`, error)

  if (error instanceof Error) {
    // Handle specific error types
    if (error.message.includes('Unauthorized')) {
      return { success: false, error: 'Unauthorized', code: 401 }
    }
    if (error.message.includes('Not Found')) {
      return { success: false, error: 'Resource not found', code: 404 }
    }
  }

  return {
    success: false,
    error: 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR'
  }
}
```

#### Step 3: Update Actions to Use Standard Pattern

```typescript
// Before
export async function createProperty(...) {
  try {
    // ...
    return { code: 200, error: null, asset: data }
  } catch (error) {
    return { code: 500, error: 'Failed', asset: null }
  }
}

// After
export async function createProperty(
  data: IPropertyForm
): Promise<ActionResult<AssetData>> {
  const session = await verifySession()
  if (!session) {
    return { success: false, error: 'Unauthorized' }
  }

  try {
    // ... logic
    return { success: true, data: asset }
  } catch (error) {
    return handleActionError(error, 'createProperty')
  }
}
```

**Result:** Consistent, predictable error handling.

---

### 4. Remove TypeScript `any` Types (Ongoing)

**Problem:** Some `any` types reduce type safety.

**Solution:**

#### Find All `any` Types

```bash
# Search for 'any' types
grep -r ": any" src/
grep -r "as any" src/
```

#### Replace with Proper Types

```typescript
// Before
function processData(data: any) {
  return data.value
}

// After
function processData(data: { value: string }) {
  return data.value
}

// Or use generics
function processData<T extends { value: unknown }>(data: T): T['value'] {
  return data.value
}
```

#### Create Type Guards

```typescript
// src/lib/typeGuards.ts
export function isAsset(obj: unknown): obj is AssetData {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'Code' in obj &&
    'Title' in obj
  )
}

export function isUser(obj: unknown): obj is IUserData {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'Code' in obj &&
    'Email' in obj
  )
}
```

**Result:** Better type safety, fewer runtime errors.

---

## 📋 Refactoring Checklist

### Before Starting
- [ ] Create feature branch: `refactor/[feature-name]`
- [ ] Review existing code
- [ ] Identify all affected files
- [ ] Create backup (git commit)

### During Refactoring
- [ ] Make small, incremental changes
- [ ] Test after each change
- [ ] Update imports
- [ ] Fix TypeScript errors
- [ ] Update tests (if any)

### After Refactoring
- [ ] Test all affected functionality
- [ ] Check for console errors
- [ ] Verify translations work
- [ ] Test with different roles
- [ ] Review code changes
- [ ] Update documentation

---

## 🎯 Priority Order

1. **Dashboard Consolidation** (30 min) - Quick win
2. **Error Handling Standardization** (1-2 hours) - Foundation
3. **Server Actions Split** (2-3 hours) - Organization
4. **Type Safety** (Ongoing) - Quality
5. **Component Optimization** (1 week) - Performance

---

## 💡 Tips

1. **Start Small:** Begin with dashboard consolidation (easiest win)
2. **Test Frequently:** Don't wait until the end
3. **Use Git:** Commit after each successful refactoring
4. **Document Changes:** Update comments and docs
5. **Ask for Review:** Get feedback before merging

---

## 🚨 Common Pitfalls

1. **Don't refactor everything at once** - Break into small pieces
2. **Don't skip tests** - Test after each change
3. **Don't forget imports** - Update all import paths
4. **Don't break existing functionality** - Maintain backward compatibility
5. **Don't introduce new `any` types** - Use proper types

---

*Start with dashboard consolidation for a quick win!*











