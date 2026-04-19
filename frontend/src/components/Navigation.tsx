/**
 * Legacy Navigation component — replaced by DashboardLayout sidebar.
 *
 * This file now re-exports a simplified wrapper so that existing pages
 * that import <Navigation /> still compile.  All new pages should import
 * DashboardLayout directly instead.
 */

export default function Navigation() {
  // Sidebar navigation is now handled by DashboardLayout.
  // Existing pages that still render <Navigation /> will get an empty fragment;
  // they should be migrated to use DashboardLayout as the page wrapper.
  return null;
}
