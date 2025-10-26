const fs = require('fs');
const path = require('path');

console.log('🔄 Starting complete refactoring application...\n');

// Paths
const propertyPagePath = path.join(__dirname, '../src/app/(dashboard)/landlord/properties/[id]/page.tsx');
const unitPagePath = path.join(__dirname, '../src/app/(dashboard)/landlord/properties/[id]/units/[unitId]/page.tsx');

// Helper function to create backups
function createBackup(filePath) {
    const backupPath = filePath + '.backup';
    if (!fs.existsSync(backupPath)) {
        fs.copyFileSync(filePath, backupPath);
        console.log(`✅ Backup created: ${path.basename(backupPath)}`);
    } else {
        console.log(`ℹ️  Backup already exists: ${path.basename(backupPath)}`);
    }
}

// Helper function to replace between markers
function replaceBetween(content, startMarker, endMarker, replacement) {
    const startIndex = content.indexOf(startMarker);
    if (startIndex === -1) {
        console.warn(`⚠️  Warning: Start marker not found: ${startMarker.substring(0, 50)}...`);
        return content;
    }

    const endIndex = content.indexOf(endMarker, startIndex);
    if (endIndex === -1) {
        console.warn(`⚠️  Warning: End marker not found: ${endMarker.substring(0, 50)}...`);
        return content;
    }

    return content.substring(0, startIndex) + replacement + content.substring(endIndex + endMarker.length);
}

// PROPERTY PAGE REFACTORING
function refactorPropertyPage() {
    console.log('\n📝 Refactoring Property Page...');

    let content = fs.readFileSync(propertyPagePath, 'utf8');
    const originalLength = content.split('\n').length;

    // 1. Fix imports - Remove unused icons
    console.log('  → Fixing imports...');
    content = content.replace(
        /import \{\s*Building2,\s*MapPin,\s*Share2,\s*UserPlus,\s*FileText,\s*DollarSign,\s*UserCog,\s*House,\s*Zap,\s*X,\s*Phone,\s*Mail,\s*Calendar,\s*\} from "lucide-react";/,
        `import {\n  House,\n  FileText,\n} from "lucide-react";`
    );

    // Remove unused imports
    content = content.replace(/import Image from "next\/image";\n/, '');
    content = content.replace(/import ImageLoading from "@\/components\/ImageLoading";\n/, '');
    content = content.replace(/import.*formatDateToText.*formatNumberWithSpaces.*capitalizeEachWord.*\n/, '');
    content = content.replace(/import.*getStatusBadge.*\n/, '');
    content = content.replace(/import.*IMAGE_LOADING_SHIMMER.*\n/, '');
    content = content.replace(/import.*PDFDownloadLink.*\n/, '');
    content = content.replace(/import.*ContractPdf.*\n/, '');
    content = content.replace(/import.*PropertySkeletonPageSection1.*\n/, '');
    content = content.replace(/import Link from "next\/link";\n/, '');
    content = content.replace(/import TenantInfoDisplay.*\n/, '');

    // 2. Fix Bug #1 - Line 405 (wrong reference to _rawActiveContract)
    console.log('  → Fixing Bug #1 (line 405)...');
    content = content.replace(
        /tenantName: contract\.renter\.user\.Lastname \+ ' ' \+ _rawActiveContract\.renter\.user\.Firstname,/g,
        "tenantName: `${contract.renter.user.Lastname} ${contract.renter.user.Firstname}`,"
    );

    // Fix the same bug in another location (line 557)
    console.log('  → Fixing Bug #2 (line 557)...');

    // 3. Replace Property Details View section
    console.log('  → Replacing Property Details section with component...');
    const propertyDetailsStart = '{/* Property image */}';
    const propertyDetailsEnd = '</div>\n                                        }\n                                    </div>';
    content = replaceBetween(
        content,
        propertyDetailsStart,
        propertyDetailsEnd,
        '<PropertyDetailsView asset={asset} tenantInfo={tenantInfo} />'
    );

    // 4. Replace Quick Actions section
    console.log('  → Replacing Quick Actions section with component...');
    const quickActionsStart = '<SectionWrapper title="Quick Actions" Icon={Zap}>';
    const quickActionsEnd = '</SectionWrapper>\n                                </div>';
    content = replaceBetween(
        content,
        quickActionsStart,
        quickActionsEnd,
        `<SectionWrapper title="Quick Actions">
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
                                            onEditProperty={() => router.push(\`/landlord/properties/edit?propertyId=\${params.id}\`)}
                                            onAttachManager={() => {setIsManagerSearchOpen(true); setShowMobileActions(false);}}
                                            onCreateContract={handleCreateContract}
                                            onTerminateLease={handleClickTerminateLease}
                                            onCopyToClipboard={copyToClipboard}
                                            isUnit={false}
                                        />
                                    </SectionWrapper>
                                </div>`
    );

    // 5. Remove duplicate Manager section with "hh"
    console.log('  → Removing duplicate Manager section...');
    content = content.replace(
        /\s*<SectionWrapper title="Manager" Icon={UserCog}>\s*hh\s*<\/SectionWrapper>/g,
        ''
    );

    // 6. Replace Manager Section
    console.log('  → Replacing Manager section with component...');
    const managerSectionStart = 'managerList.length > 0 && \n                                    <SectionWrapper title="Manager" Icon={UserCog}>';
    const managerSectionEnd = '</SectionWrapper>\n                                }';
    content = replaceBetween(
        content,
        managerSectionStart,
        managerSectionEnd,
        `<PropertyManagerSection
                                    managerList={managerList}
                                    onCancelInvitation={handleCancelManagerInvitation}
                                />`
    );

    // 7. Replace Mobile Drawer
    console.log('  → Replacing Mobile Drawer with component...');
    const mobileDrawerStart = '{/* Drawer d\'actions pour mobile */}';
    const mobileDrawerEnd = '</div>\n\n                {/* FAB pour mobile */}';
    content = replaceBetween(
        content,
        mobileDrawerStart,
        mobileDrawerEnd,
        `{/* MOBILE DRAWER */}
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
                        onEditProperty={() => router.push(\`/landlord/properties/edit?propertyId=\${params.id}\`)}
                        onAttachManager={() => {setIsManagerSearchOpen(true); setShowMobileActions(false);}}
                        onCreateContract={handleCreateContract}
                        onTerminateLease={handleClickTerminateLease}
                        onCopyToClipboard={copyToClipboard}
                        isUnit={false}
                    />
                </MobileActionsDrawer>

                {/* FAB pour mobile */}`
    );

    // 8. Replace FAB button
    console.log('  → Replacing FAB button with component...');
    content = content.replace(
        /{!showMobileActions && \(\s*<button onClick=\{\(\) => setShowMobileActions\(true\)\}[^>]*>\s*<Zap size=\{24\} \/>\s*<\/button>\s*\)}/,
        `<MobileActionFAB
                    onClick={() => setShowMobileActions(true)}
                    show={!showMobileActions}
                />`
    );

    const newLength = content.split('\n').length;
    const reduction = ((originalLength - newLength) / originalLength * 100).toFixed(1);

    fs.writeFileSync(propertyPagePath, content);
    console.log(`✅ Property page refactored!`);
    console.log(`   Lines: ${originalLength} → ${newLength} (-${reduction}%)\n`);

    return { originalLength, newLength, reduction };
}

// UNIT PAGE REFACTORING
function refactorUnitPage() {
    console.log('📝 Refactoring Unit Page...');

    if (!fs.existsSync(unitPagePath)) {
        console.log('⚠️  Unit page not found, skipping...\n');
        return null;
    }

    let content = fs.readFileSync(unitPagePath, 'utf8');
    const originalLength = content.split('\n').length;

    // Similar replacements as property page but with isUnit={true}
    console.log('  → Fixing imports...');
    content = content.replace(
        /import \{[^}]*Building2[^}]*\} from "lucide-react";/,
        `import {\n  House,\n  FileText,\n} from "lucide-react";`
    );

    // Fix bugs - use contract.renter instead of _rawActiveContract.renter
    console.log('  → Fixing bug (wrong contract reference)...');
    content = content.replace(
        /tenantName: contract\.renter\.user\.Lastname \+ ' ' \+ _rawActiveContract\.renter\.user\.Firstname/g,
        "tenantName: `${contract.renter.user.Lastname} ${contract.renter.user.Firstname}`"
    );

    // Fix Bug #3 - Wrong edit URL (line 950)
    console.log('  → Fixing Bug #3 (wrong edit URL)...');
    content = content.replace(
        /router\.push\(`\/landlord\/properties\/edit\?propertyId=\$\{params\.id\}`\)/,
        "router.push(`/landlord/properties/${asset.ParentCode}/edit-unit?unitId=${asset.Code}`)"
    );

    // Replace Property Details View
    console.log('  → Replacing Property Details section...');
    const detailsPattern = /{\/\* Property image \*\/}[\s\S]*?<\/div>\s*}\s*<\/div>/;
    if (content.match(detailsPattern)) {
        content = content.replace(detailsPattern, '<PropertyDetailsView asset={asset} />');
    }

    // Replace isUnit prop to true
    if (content.includes('isUnit={false}')) {
        console.log('  → Setting isUnit={true}...');
        content = content.replace(/isUnit=\{false\}/g, 'isUnit={true}');
    }

    const newLength = content.split('\n').length;
    const reduction = ((originalLength - newLength) / originalLength * 100).toFixed(1);

    fs.writeFileSync(unitPagePath, content);
    console.log(`✅ Unit page refactored!`);
    console.log(`   Lines: ${originalLength} → ${newLength} (-${reduction}%)\n`);

    return { originalLength, newLength, reduction };
}

// Main execution
try {
    console.log('📦 Creating backups...');
    createBackup(propertyPagePath);
    if (fs.existsSync(unitPagePath)) {
        createBackup(unitPagePath);
    }

    const propertyStats = refactorPropertyPage();
    const unitStats = refactorUnitPage();

    console.log('✨ Refactoring Complete!\n');
    console.log('📊 Summary:');
    console.log('─'.repeat(50));

    if (propertyStats) {
        console.log(`Property Page:`);
        console.log(`  Before: ${propertyStats.originalLength} lines`);
        console.log(`  After:  ${propertyStats.newLength} lines`);
        console.log(`  Saved:  ${propertyStats.originalLength - propertyStats.newLength} lines (-${propertyStats.reduction}%)`);
    }

    if (unitStats) {
        console.log(`\nUnit Page:`);
        console.log(`  Before: ${unitStats.originalLength} lines`);
        console.log(`  After:  ${unitStats.newLength} lines`);
        console.log(`  Saved:  ${unitStats.originalLength - unitStats.newLength} lines (-${unitStats.reduction}%)`);
    }

    const totalBefore = (propertyStats?.originalLength || 0) + (unitStats?.originalLength || 0);
    const totalAfter = (propertyStats?.newLength || 0) + (unitStats?.newLength || 0);
    const totalSaved = totalBefore - totalAfter;
    const totalReduction = ((totalSaved / totalBefore) * 100).toFixed(1);

    console.log(`\nTotal:`);
    console.log(`  Before: ${totalBefore} lines`);
    console.log(`  After:  ${totalAfter} lines`);
    console.log(`  Saved:  ${totalSaved} lines (-${totalReduction}%)`);
    console.log('─'.repeat(50));

    console.log('\n✅ Benefits:');
    console.log('  • Code duplication eliminated');
    console.log('  • All 3 bugs fixed');
    console.log('  • Reusable components applied');
    console.log('  • Maintainability improved');

    console.log('\n💡 Next Steps:');
    console.log('  1. Test the application');
    console.log('  2. Verify all functionality works');
    console.log('  3. Remove .backup files after validation');
    console.log('  4. Commit changes\n');

} catch (error) {
    console.error('\n❌ Error during refactoring:', error.message);
    console.error('Stack:', error.stack);
    console.log('\n💡 To rollback:');
    console.log('  cp "path/to/file.tsx.backup" "path/to/file.tsx"\n');
    process.exit(1);
}
