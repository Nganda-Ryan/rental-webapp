# Refactoring à Appliquer - Actions Concrètes

## Situation Actuelle

J'ai créé les composants réutilisables, mais je ne les ai **pas encore appliqués** dans les pages existantes. Les fichiers ont toujours leur code dupliqué original.

## Ce qui a été créé ✅

1. **Composants**:
   - `src/components/feature/Properties/PropertyDetailsView.tsx`
   - `src/components/feature/Properties/PropertyQuickActions.tsx`
   - `src/components/feature/Properties/PropertyManagerSection.tsx`

2. **Configuration**:
   - `src/config/propertyTableColumns.tsx`

## Ce qu'il faut faire maintenant 🔨

### Fichier 1: `src/app/(dashboard)/landlord/properties/[id]/page.tsx`

#### Étape 1: Remplacer l'affichage des détails (lignes ~697-788)

**SUPPRIMER ce bloc:**
```tsx
{/* Property image */}
<div className="rounded-lg overflow-hidden h-100">
    {asset && (!(asset?.CoverUrl == "") || !asset?.CoverUrl) ?
        <Image ... />
        :
        <ImageLoading />
    }
</div>

{/* Property detail */}
<div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
    <div className="flex justify-between items-start mb-4">
        ... (tout le contenu jusqu'à la fin de cette div incluant tenant info)
    </div>
</div>
```

**REMPLACER par:**
```tsx
<PropertyDetailsView asset={asset} tenantInfo={tenantInfo} />
```

#### Étape 2: Remplacer les Quick Actions (lignes ~865-931)

**SUPPRIMER tout le SectionWrapper "Quick Actions":**
```tsx
<SectionWrapper title="Quick Actions" Icon={Zap}>
    {asset?.whoIs == "OWNER" && <>
        ... (tous les boutons)
    </>}
    ... (show share link div)
</SectionWrapper>
```

**REMPLACER par:**
```tsx
<SectionWrapper title="Quick Actions">
    <PropertyQuickActions
        asset={asset}
        activeContract={activeContract}
        isTerminatingContract={isTerminatingContract}
        showShareLink={showShareLink}
        clicked={clicked}
        canCreateContract={canCreateContract()}
        canAttachManager={canAttachManager()}
        onShareLink={handleShareLink}
        onVerifyProperty={handleVerificationFormOpen}
        onAttachProperties={() => setIsAttachPropertiesModalOpen(true)}
        onEditProperty={() => router.push(`/landlord/properties/edit?propertyId=${params.id}`)}
        onAttachManager={() => {setIsManagerSearchOpen(true); setShowMobileActions(false);}}
        onCreateContract={handleCreateContract}
        onTerminateLease={handleClickTerminateLease}
        onCopyToClipboard={copyToClipboard}
        isUnit={false}
    />
</SectionWrapper>
```

#### Étape 3: Remplacer la section Manager (lignes ~935-988)

**SUPPRIMER:**
```tsx
{managerList.length > 0 &&
    <SectionWrapper title="Manager" Icon={UserCog}>
    {managerList.map((manager) => (
        ... (tout le mapping)
    ))}
    </SectionWrapper>
}
```

**ET SUPPRIMER AUSSI les lignes 986-988:**
```tsx
<SectionWrapper title="Manager" Icon={UserCog}>
    hh
</SectionWrapper>
```

**REMPLACER par:**
```tsx
<PropertyManagerSection
    managerList={managerList}
    onCancelInvitation={handleCancelManagerInvitation}
/>
```

#### Étape 4: Remplacer le Mobile Drawer (lignes ~998-1074)

**SUPPRIMER tout le div "Drawer d'actions pour mobile":**
```tsx
<div className={`fixed inset-0 z-50 lg:hidden ...`}>
    ... (tout le contenu)
</div>
```

**REMPLACER par:**
```tsx
<MobileActionsDrawer
    showMobileActions={showMobileActions}
    onClose={() => setShowMobileActions(false)}
>
    <PropertyQuickActions
        asset={asset}
        activeContract={activeContract}
        isTerminatingContract={isTerminatingContract}
        showShareLink={showShareLink}
        clicked={clicked}
        canCreateContract={canCreateContract()}
        canAttachManager={canAttachManager()}
        onShareLink={handleShareLink}
        onVerifyProperty={handleVerificationFormOpen}
        onAttachProperties={() => setIsAttachPropertiesModalOpen(true)}
        onEditProperty={() => router.push(`/landlord/properties/edit?propertyId=${params.id}`)}
        onAttachManager={() => {setIsManagerSearchOpen(true); setShowMobileActions(false);}}
        onCreateContract={handleCreateContract}
        onTerminateLease={handleClickTerminateLease}
        onCopyToClipboard={copyToClipboard}
        isUnit={false}
    />
</MobileActionsDrawer>
```

#### Étape 5: Remplacer le FAB mobile (lignes ~1076-1080)

**SUPPRIMER:**
```tsx
{!showMobileActions && (
    <button onClick={() => setShowMobileActions(true)} ...>
        <Zap size={24} />
    </button>
)}
```

**REMPLACER par:**
```tsx
<MobileActionFAB
    onClick={() => setShowMobileActions(true)}
    show={!showMobileActions}
/>
```

#### Étape 6: Corriger les bugs identifiés

**Bug 1 - Ligne 405:**
```tsx
// AVANT (MAUVAIS):
tenantName: contract.renter.user.Lastname + ' ' + _rawActiveContract.renter.user.Firstname,

// APRÈS (BON):
tenantName: `${contract.renter.user.Lastname} ${contract.renter.user.Firstname}`,
```

**Bug 2 - Ligne 557:**
```tsx
// AVANT (MAUVAIS):
tenantName: contract.renter.user.Lastname + ' ' + _rawActiveContract.renter.user.Firstname,

// APRÈS (BON):
tenantName: `${contract.renter.user.Lastname} ${contract.renter.user.Firstname}`,
```

### Fichier 2: `src/app/(dashboard)/landlord/properties/[id]/units/[unitId]/page.tsx`

Appliquer les mêmes changements avec ces différences:

1. **PropertyQuickActions** : ajouter `isUnit={true}`
2. **onEditProperty** : utiliser ParentCode
```tsx
onEditProperty={() => router.push(`/landlord/properties/${asset.ParentCode}/edit-unit?unitId=${asset.Code}`)}
```
3. Ne pas afficher la section "Units" (elle n'existe que pour les properties)
4. Utiliser `getContractColumnsSimple()` au lieu de `getContractColumns(asset, user)`

## Imports à ajouter

Dans les deux fichiers, ajouter en haut:
```tsx
import { getContractColumns, getInvoiceColumns, getUnitColumns } from "@/config/propertyTableColumns";
import { PropertyQuickActions, MobileActionsDrawer, MobileActionFAB } from "@/components/feature/Properties/PropertyQuickActions";
import { PropertyManagerSection } from "@/components/feature/Properties/PropertyManagerSection";
import { PropertyDetailsView } from "@/components/feature/Properties/PropertyDetailsView";
```

## Imports à supprimer

Supprimer les imports inutilisés après le refactoring:
```tsx
// À supprimer:
import { Building2, MapPin, Share2, UserPlus, DollarSign, UserCog, Zap, X, Phone, Mail } from "lucide-react";
import Image from "next/image";
import ImageLoading from "@/components/ImageLoading";
import { formatDateToText, formatNumberWithSpaces, capitalizeEachWord } from "@/lib/utils";
import { getStatusBadge } from "@/lib/utils-component";
import { IMAGE_LOADING_SHIMMER } from "@/constant";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { ContractPdf } from "@/components/pdf/ContractPdf";

// À garder:
import { House, FileText } from "lucide-react";
import { capitalize } from "@/lib/utils";
```

## Résultat Attendu

### Avant:
- properties/[id]/page.tsx: **1179 lignes**
- units/[unitId]/page.tsx: **1075 lignes**
- **Total: 2254 lignes**

### Après:
- properties/[id]/page.tsx: **~600-650 lignes** (-45%)
- units/[unitId]/page.tsx: **~500-550 lignes** (-48%)
- **Total: ~1100-1200 lignes**

### Avantages:
- ✅ Réduction de 50% du code
- ✅ 0 duplication
- ✅ Tous les bugs corrigés
- ✅ Components réutilisables
- ✅ Maintenabilité+++

## Comment appliquer

**Option 1 - Manuelle** (recommandée pour comprendre):
1. Ouvrir le fichier dans VS Code
2. Chercher chaque section à remplacer
3. Supprimer l'ancien code
4. Copier-coller le nouveau code
5. Vérifier les imports
6. Tester

**Option 2 - Script automatique**:
```bash
node scripts/apply-refactoring.js
```
(Je peux créer ce script si nécessaire)

---

**Note**: Je reconnais que j'ai créé les composants mais ne les ai pas encore appliqués dans les pages. C'est ce qu'il faut faire maintenant pour que le refactoring soit complet.
