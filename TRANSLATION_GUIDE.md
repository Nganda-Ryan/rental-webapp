# Guide de Traduction - Status et Billing Items

## Aperçu

Les statuts et les éléments de facturation (billing items) sont maintenant traduits dans l'application. Ce document explique comment utiliser correctement les traductions.

**Note:** Les amenities (équipements) ne sont PAS traduits car ils sont saisis manuellement par les utilisateurs et il est difficile de les anticiper.

## Status (Statuts)

### Traductions Disponibles

Les statuts suivants sont disponibles en anglais et en français :

- `draft` / `drafting` - Brouillon / En rédaction
- `pending` / `pending_approval` - En attente / En attente d'approbation
- `approved` - Approuvé
- `rented` - Loué
- `active` - Actif
- `paid` - Payé
- `available` - Disponible
- `canceled` / `cancel` - Annulé
- `rejected` - Rejeté
- `unpaid` - Impayé
- `inactive` - Inactif

### Utilisation

#### Option 1: Utilisation directe avec `getStatusBadge`

```tsx
import { getStatusBadge } from '@/lib/utils-component';
import { useTranslations } from 'next-intl';

function MyComponent() {
  const t = useTranslations('Status');

  return (
    <div>
      {getStatusBadge('AVAILABLE', t)}
    </div>
  );
}
```

#### Option 2: Utilisation du composant `StatusBadge`

```tsx
import { StatusBadge } from '@/components/StatusBadge';

function MyComponent() {
  return (
    <div>
      <StatusBadge status="AVAILABLE" />
    </div>
  );
}
```

## Billing Items (Éléments de Facturation)

### Traductions Disponibles

Les éléments de facturation suivants sont traduits dans `Common` :

- `WATER` - Eau / Water
- `ELEC` - Électricité / Electricity
- `INET01` - Service Internet / Internet Service
- `GAS` - Gaz / Gas
- `RENT` - Loyer / Rent
- `SVCOLD` - Ancien service / Old Service

### Utilisation

Les billing items sont automatiquement traduits dans le composant `AssetDetailsCard`. Si vous devez les utiliser ailleurs :

```tsx
import { useTranslations } from 'next-intl';

function MyComponent({ billingItems }: { billingItems: Array<{label: string; value: string}> }) {
  const t = useTranslations('Common');

  return (
    <div>
      {billingItems.map((item, index) => {
        const itemLabel = typeof item === 'string' ? item : item.label;
        const translatedLabel = t(itemLabel as any) || itemLabel;

        return <span key={index}>{translatedLabel}</span>;
      })}
    </div>
  );
}
```

## Amenities (Équipements)

**Les amenities ne sont PAS traduits** car ils sont saisis manuellement par les utilisateurs. Ils sont affichés tels quels, avec une capitalisation automatique via `capitalizeEachWord()`.

## Ajout de Nouvelles Traductions

### Pour ajouter un nouveau statut :

1. Ajoutez la traduction dans `messages/en.json` :
```json
{
  "Status": {
    "new_status": "New Status"
  }
}
```

2. Ajoutez la traduction dans `messages/fr.json` :
```json
{
  "Status": {
    "new_status": "Nouveau Statut"
  }
}
```

### Pour ajouter un nouvel élément de facturation :

1. Ajoutez la constante dans `src/constant/index.ts` :
```typescript
export const BILLING_ITEM_TYPE_OBJ_LIST = [
  // ... existing items
  {label: "Nouveau Service", value: "NEW_SERVICE"},
];
```

2. Ajoutez la traduction dans `messages/en.json` sous `Common` :
```json
{
  "Common": {
    "NEW_SERVICE": "New Service"
  }
}
```

3. Ajoutez la traduction dans `messages/fr.json` sous `Common` :
```json
{
  "Common": {
    "NEW_SERVICE": "Nouveau Service"
  }
}
```

## Notes Importantes

- **Statuts:** Les clés de traduction doivent être en minuscules avec des underscores (`_`) au lieu d'espaces
- **Billing Items:** Les clés sont en majuscules (ex: `WATER`, `ELEC`, `RENT`)
- **Amenities:** NE SONT PAS traduits - ils sont affichés tels que saisis par l'utilisateur
- Si une traduction n'est pas trouvée, le texte original sera affiché
- Le composant `AssetDetailsCard` utilise déjà les traductions pour les statuts et les billing items
- Le composant `StatusBadge` peut être utilisé partout où vous avez besoin d'afficher un statut traduit

## Composants Utilisant les Traductions

### AssetDetailsCard

Ce composant traduit automatiquement :
- **Status** : via `getStatusBadge(asset.Status, tStatus)`
- **Billing Items** : via `tBilling(itemLabel)`
- **Amenities** : Affichés sans traduction avec `capitalizeEachWord()`
