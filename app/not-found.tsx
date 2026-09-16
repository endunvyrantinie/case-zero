import Link from "next/link";
export default function NotFound() { return <main className="not-found"><div className="eyebrow">CASE//ZERO</div><h1>FILE NOT FOUND</h1><p>This case does not exist or has been removed from the active board.</p><Link href="/" className="primary-link">RETURN TO CASE LIBRARY</Link></main>; }
