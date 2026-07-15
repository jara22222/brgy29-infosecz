import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => {
                    // 1. Calculate active state once
                    const isActive = page.url.startsWith(
                        typeof item.href === 'string'
                            ? item.href
                            : item.href.url,
                    );

                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                size="xl"
                                isActive={isActive}
                                tooltip={{ children: item.title }}
                                // 2. CONDITIONAL STYLING EXPLAINED:
                                // - hover:bg-[#172F92]/10  -> Lighter blue tint when hovering (inactive state)
                                // - data-[active=true]:bg-[#172F92] -> Your exact dark blue when Active/Clicked
                                // - data-[active=true]:text-white   -> White text when Active
                                className="h-12 px-4 transition-all hover:bg-[#172F92]/10 data-[active=true]:bg-[#172F92] data-[active=true]:text-white"
                            >
                                <Link
                                    href={item.href}
                                    prefetch
                                    className="flex w-full items-center gap-3"
                                >
                                    {/* Icon: Auto-colors based on parent text color */}
                                    {item.icon && (
                                        <item.icon className="h-5 w-5 shrink-0" />
                                    )}

                                    <span className="font-inter text-base text-[14px]">
                                        {item.title}
                                    </span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
