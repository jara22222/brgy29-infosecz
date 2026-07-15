import { ColumnDef } from '@tanstack/react-table';

export type Residents = {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    // You didn't have 'role' in your type, I added it below if you need it.
    // If your data doesn't have a role, remove that column.
    role?: string;
};

export const columns: ColumnDef<Residents>[] = [
    {
        // OLD: accessorKey: 'Name' (Wrong, doesn't exist in type)
        // NEW: accessorKey: 'name' (Correct, matches Residents type)
        accessorKey: 'name',
        header: 'Name',
    },
    {
        // OLD: accessorKey: 'Role'
        // NEW: accessorKey: 'role' (Ensure your data actually has this key!)
        accessorKey: 'role',
        header: 'Role',
    },
    {
        // OLD: accessorKey: 'Email address'
        // NEW: accessorKey: 'email'
        accessorKey: 'email',
        header: 'Email address',
    },
    {
        // OLD: accessorKey: 'Date joined'
        // NEW: accessorKey: 'createdAt'
        accessorKey: 'createdAt',
        header: 'Date joined',
    },
];
