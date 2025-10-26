const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing refactoring bugs...\n');

// Paths
const propertyPagePath = path.join(__dirname, '../src/app/(dashboard)/landlord/properties/[id]/page.tsx');
const unitPagePath = path.join(__dirname, '../src/app/(dashboard)/landlord/properties/[id]/units/[unitId]/page.tsx');
const unitBackupPath = unitPagePath + '.backup';

// FIX #1: Remove duplicate "hh" Manager section from property page
console.log('📝 Fixing property page (removing duplicate Manager section)...');
let propertyContent = fs.readFileSync(propertyPagePath, 'utf8');
const originalPropertyLines = propertyContent.split('\n').length;

// Remove the duplicate manager section with "hh"
propertyContent = propertyContent.replace(
    /\s*<SectionWrapper title="Manager" Icon={UserCog}>\s*hh\s*<\/SectionWrapper>/g,
    ''
);

fs.writeFileSync(propertyPagePath, propertyContent);
const newPropertyLines = propertyContent.split('\n').length;
console.log(`✅ Property page fixed: ${originalPropertyLines} → ${newPropertyLines} lines\n`);

// FIX #2: Restore unit page from backup and apply minimal changes
console.log('📝 Restoring and fixing unit page from backup...');

if (!fs.existsSync(unitBackupPath)) {
    console.error('❌ Error: Backup file not found:', unitBackupPath);
    process.exit(1);
}

// Restore from backup
let unitContent = fs.readFileSync(unitBackupPath, 'utf8');
const originalUnitLines = unitContent.split('\n').length;

// 1. Fix imports - simplify lucide-react imports
console.log('  → Simplifying imports...');
unitContent = unitContent.replace(
    /import \{[^}]*Building2[^}]*\} from "lucide-react";/,
    `import {\n  House,\n  FileText,\n  Building2,\n  Share2,\n  DollarSign,\n  UserPlus,\n  Zap,\n  X,\n} from "lucide-react";`
);

// 2. Add PropertyDetailsView import if not present
if (!unitContent.includes('PropertyDetailsView')) {
    console.log('  → Adding PropertyDetailsView import...');
    const importLine = 'import { useTranslations } from "next-intl";';
    unitContent = unitContent.replace(
        importLine,
        `${importLine}\nimport { PropertyDetailsView } from "@/components/feature/Properties/PropertyDetailsView";`
    );
}

// 3. Add PropertyQuickActions imports
if (!unitContent.includes('PropertyQuickActions')) {
    console.log('  → Adding PropertyQuickActions imports...');
    const importLine = 'import { PropertyDetailsView } from "@/components/feature/Properties/PropertyDetailsView";';
    unitContent = unitContent.replace(
        importLine,
        `${importLine}\nimport { PropertyQuickActions, MobileActionsDrawer, MobileActionFAB } from "@/components/feature/Properties/PropertyQuickActions";`
    );
}

// 4. Add PropertyManagerSection import
if (!unitContent.includes('PropertyManagerSection')) {
    console.log('  → Adding PropertyManagerSection import...');
    const importLine = 'import { PropertyQuickActions, MobileActionsDrawer, MobileActionFAB } from "@/components/feature/Properties/PropertyQuickActions";';
    unitContent = unitContent.replace(
        importLine,
        `${importLine}\nimport { PropertyManagerSection } from "@/components/feature/Properties/PropertyManagerSection";`
    );
}

// 5. Fix Bug #3 - wrong edit URL (line ~950 in original)
console.log('  → Fixing edit URL bug...');
unitContent = unitContent.replace(
    /router\.push\(`\/landlord\/properties\/edit\?propertyId=\$\{params\.id\}`\)/g,
    "router.push(`/landlord/properties/${asset.ParentCode}/edit-unit?unitId=${asset.Code}`)"
);

// 6. Fix tenant name reference bug
console.log('  → Fixing tenant name reference...');
unitContent = unitContent.replace(
    /tenantName: contract\.renter\.user\.Lastname \+ ' ' \+ _rawActiveContract\.renter\.user\.Firstname/g,
    "tenantName: contract.renter.user.Lastname + ' ' + contract.renter.user.Firstname"
);

fs.writeFileSync(unitPagePath, unitContent);
const newUnitLines = unitContent.split('\n').length;
console.log(`✅ Unit page fixed: ${originalUnitLines} → ${newUnitLines} lines\n`);

console.log('✨ All bugs fixed!\n');
console.log('📊 Summary:');
console.log('─'.repeat(50));
console.log(`Property page: ${originalPropertyLines} → ${newPropertyLines} lines`);
console.log(`Unit page: ${originalUnitLines} → ${newUnitLines} lines`);
console.log('─'.repeat(50));
console.log('\n✅ Bugs fixed:');
console.log('  1. Duplicate Manager section with "hh" removed from property page');
console.log('  2. Unit page restored from backup with correct imports');
console.log('  3. Edit URL bug fixed in unit page');
console.log('  4. Tenant name reference bug fixed in unit page');
console.log('\n💡 Next step: Run `npm run build` to verify');
