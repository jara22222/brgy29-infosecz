import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { UserMenuContent } from '@/components/user-menu-content';
import {
    adminaccountmanagement,
    admindocument,
    dashboard,
    staffdashboard,
} from '@/routes';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    ChevronDown,
    FileText,
    Folder,
    FolderCog,
    History,
    Home,
    Menu,
    Moon,
    Phone,
    Sun,
    UserCog,
    X,
} from 'lucide-react';
import { useState } from 'react';
import NotificationDropdown from './notification-dropdown';

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export default function AppSidebar({ documents }: { documents?: any[] }) {
    const { auth } = usePage<any>().props;
    const [showDocumentDropdown, setShowDocumentDropdown] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    // Fallback documents if not available from page props
    const fallbackDocuments = [
        { id: 1, documentName: 'Barangay Certificate' },
        { id: 2, documentName: 'Barangay Clearance' },
        { id: 3, documentName: 'Certificate of Residency' },
        { id: 4, documentName: 'Certificate of Indigency' },
    ];

    const displayDocuments = documents || fallbackDocuments;

    // For non-admin and non-staff users, create a navbar instead of sidebar
    if (auth.user.role !== 'admin' && auth.user.role !== 'staff') {
        return (
            <nav className="fixed top-0 z-50 flex h-16 w-full items-center justify-between bg-background px-3 font-inter text-[#172F92] shadow-md sm:px-6 lg:px-12 xl:px-16 2xl:px-20">
                <div className="flex items-center gap-4">
                    <Link href={dashboard()} prefetch>
                        <img
                            src="/myassets/Logo.png"
                            alt="BRGY. 29-C ONLINE PORTAL"
                            className="h-8 w-auto object-cover sm:h-10"
                        />
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden items-center gap-6 md:flex lg:gap-8">
                    <div className="flex items-center gap-4 lg:gap-6">
                        <Link
                            href="/resident-dashboard"
                            className="flex cursor-pointer items-center gap-2 text-sm hover:underline lg:text-base"
                        >
                            <Home size={16} />
                            <span className="hidden sm:inline">Home</span>
                        </Link>
                        <Link
                            href="/resident-dashboard/request-history"
                            className="flex cursor-pointer items-center gap-2 text-sm hover:underline lg:text-base"
                        >
                            <History size={16} />
                            <span className="hidden sm:inline">
                                Request History
                            </span>
                        </Link>

                        <div className="relative">
                            <button
                                onClick={() =>
                                    setShowDocumentDropdown(
                                        !showDocumentDropdown,
                                    )
                                }
                                className="flex cursor-pointer items-center gap-2 text-sm hover:underline lg:text-base"
                            >
                                <FileText size={16} />
                                <span className="hidden sm:inline">
                                    Request Document
                                </span>
                                <ChevronDown size={14} />
                            </button>

                            {showDocumentDropdown && (
                                <div className="absolute top-full left-0 z-50 mt-2 w-48 rounded-lg border border-border bg-background shadow-lg">
                                    {displayDocuments.map(
                                        (doc: {
                                            id: number;
                                            documentName: string;
                                        }) => (
                                            <Link
                                                key={doc.id}
                                                href={
                                                    doc.documentName ===
                                                    'Barangay Certificate'
                                                        ? '/dashboard'
                                                        : `/documents/request/${doc.id}`
                                                }
                                                className="block cursor-pointer px-4 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                            >
                                                {doc.documentName}
                                            </Link>
                                        ),
                                    )}
                                </div>
                            )}
                        </div>

                        <Link
                            href="#contacts"
                            className="flex cursor-pointer items-center gap-2 text-sm hover:underline lg:text-base"
                        >
                            <Phone size={16} />
                            <span className="hidden sm:inline">Contacts</span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-2 lg:gap-4">
                        <NotificationDropdown />

                        {/* Dark/Light Mode Toggle */}
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className="cursor-pointer rounded p-2 hover:bg-accent hover:text-accent-foreground"
                        >
                            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                        </button>

                        {/* User Dropdown using existing Laravel user menu */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex cursor-pointer items-center gap-2 text-sm hover:underline lg:text-base">
                                    <span className="hidden sm:inline">
                                        {auth.user.name}
                                    </span>
                                    <ChevronDown size={14} />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                                align="end"
                                side="bottom"
                            >
                                <UserMenuContent user={auth.user} />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                    className="flex cursor-pointer rounded p-2 hover:bg-accent hover:text-accent-foreground md:hidden"
                >
                    {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Mobile Menu */}
                {showMobileMenu && (
                    <div className="absolute top-16 right-0 left-0 z-40 bg-background shadow-lg md:hidden">
                        <div className="flex flex-col space-y-4 p-4">
                            <Link
                                href="/resident-dashboard"
                                className="flex cursor-pointer items-center gap-2 text-sm hover:underline"
                                onClick={() => setShowMobileMenu(false)}
                            >
                                <Home size={16} />
                                Home
                            </Link>
                            <Link
                                href="/resident-dashboard/request-history"
                                className="flex cursor-pointer items-center gap-2 text-sm hover:underline"
                                onClick={() => setShowMobileMenu(false)}
                            >
                                <History size={16} />
                                Request History
                            </Link>

                            <div className="relative">
                                <button
                                    onClick={() =>
                                        setShowDocumentDropdown(
                                            !showDocumentDropdown,
                                        )
                                    }
                                    className="flex cursor-pointer items-center gap-2 text-sm hover:underline"
                                >
                                    <FileText size={16} />
                                    Request Document
                                    <ChevronDown size={14} />
                                </button>

                                {showDocumentDropdown && (
                                    <div className="mt-2 w-full rounded-lg border border-border bg-background shadow-lg">
                                        {displayDocuments.map(
                                            (doc: {
                                                id: number;
                                                documentName: string;
                                            }) => (
                                                <Link
                                                    key={doc.id}
                                                    href={
                                                        doc.documentName ===
                                                        'Barangay Certificate'
                                                            ? '/dashboard'
                                                            : `/documents/request/${doc.id}`
                                                    }
                                                    className="block cursor-pointer px-4 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                                    onClick={() =>
                                                        setShowMobileMenu(false)
                                                    }
                                                >
                                                    {doc.documentName}
                                                </Link>
                                            ),
                                        )}
                                    </div>
                                )}
                            </div>

                            <Link
                                href="#contacts"
                                className="flex cursor-pointer items-center gap-2 text-sm hover:underline"
                                onClick={() => setShowMobileMenu(false)}
                            >
                                <Phone size={16} />
                                Contacts
                            </Link>

                            <div className="flex items-center justify-between border-t pt-4">
                                <div className="flex items-center gap-2">
                                    <NotificationDropdown />

                                    {/* Dark/Light Mode Toggle */}
                                    <button
                                        onClick={() => setDarkMode(!darkMode)}
                                        className="cursor-pointer rounded p-2 hover:bg-accent hover:text-accent-foreground"
                                    >
                                        {darkMode ? (
                                            <Sun size={18} />
                                        ) : (
                                            <Moon size={18} />
                                        )}
                                    </button>
                                </div>

                                {/* User Dropdown */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="flex cursor-pointer items-center gap-2 text-sm hover:underline">
                                            {auth.user.name}
                                            <ChevronDown size={14} />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                                        align="end"
                                        side="bottom"
                                    >
                                        <UserMenuContent user={auth.user} />
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        );
    }

    const mainNavItems: NavItem[] = [
        ...(auth.user.role === 'admin'
            ? [
                  {
                      title: 'Account Management',
                      href: adminaccountmanagement(),
                      icon: UserCog,
                  },
              ]
            : []),
        ...(auth.user.role === 'admin'
            ? [
                  {
                      title: 'Documents Library',
                      href: admindocument(),
                      icon: UserCog,
                  },
              ]
            : []),
        ...(auth.user.role === 'admin'
            ? [
                  {
                      title: 'Audit Logs',
                      href: '/admin/audit-logs',
                      icon: FileText,
                  },
              ]
            : []),
        ...(auth.user.role === 'staff'
            ? [
                  {
                      title: 'Request Management',
                      href: staffdashboard(),
                      icon: FolderCog,
                  },
              ]
            : []),
    ];
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            className="flex items-center justify-center"
                            size="lg"
                            asChild
                        >
                            <Link href={dashboard()} prefetch>
                                <img
                                    src="/myassets/Logo.png"
                                    alt="BRGY. 29-C ONLINE PORTAL"
                                    className="h-12 w-auto object-cover transition-all duration-300 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8"
                                />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
            </SidebarFooter>
        </Sidebar>
    );
}
