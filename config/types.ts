
interface UserStats {
    total: number;
    male: number;
    female: number;
    prefer_not_say: number;
}

interface AgentsStats {
    total: number;
    approved: number;
    not_approved: number;
    agrovets: number;
    freelancers: number;
}

interface ContactFormEntriesStats {
    total: number;
    read: number;
    unread: number;
}

export interface Stats {
    users: UserStats;
    merchants: number;
    products: AgentsStats;
    orders: number;
    reviews: number;
    counties: number;
    subscribers: number;
    categories: number;
    blogs: number;
    contact_form_entries: ContactFormEntriesStats;
}