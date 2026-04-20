import { motion } from 'framer-motion';
import {
    LayoutDashboard, Image, Settings, ChevronLeft, ChevronRight, Brain
} from 'lucide-react';

const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'snapshots', label: 'Snapshots', icon: Image },
    { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ page, setPage, collapsed, setCollapsed }) {
    return (
        <motion.aside
            animate={{ width: collapsed ? 68 : 220 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{
                background: 'var(--bg-surface)',
                borderRight: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                flexShrink: 0,
                position: 'relative',
                zIndex: 20,
            }}
        >
            {/* Logo */}
            <div style={{
                padding: collapsed ? '18px 0' : '18px 20px',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: collapsed ? 'center' : 'flex-start',
                gap: 10,
                height: 64,
                flexShrink: 0,
            }}>
                <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 0 16px var(--primary-glow)',
                    flexShrink: 0,
                }}>
                    <Brain size={20} color="white" />
                </div>
                {!collapsed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, whiteSpace: 'nowrap' }}
                    >
                        <span style={{ background: 'linear-gradient(135deg, var(--primary-light), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Emo</span>
                        <span style={{ color: 'var(--text-primary)' }}>Sense</span>
                    </motion.div>
                )}
            </div>

            {/* Nav */}
            <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                {navItems.map(({ id, label, icon: Icon }) => {
                    const active = page === id;
                    return (
                        <motion.button
                            key={id}
                            onClick={() => setPage(id)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12,
                                padding: collapsed ? '10px 0' : '10px 12px',
                                justifyContent: collapsed ? 'center' : 'flex-start',
                                borderRadius: 10,
                                border: 'none',
                                background: active
                                    ? 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.15))'
                                    : 'transparent',
                                color: active ? 'var(--primary-light)' : 'var(--text-muted)',
                                cursor: 'pointer',
                                width: '100%',
                                fontFamily: 'var(--font-body)',
                                fontSize: 13,
                                fontWeight: active ? 600 : 500,
                                borderLeft: active ? '2px solid var(--primary)' : '2px solid transparent',
                                transition: 'all 0.2s ease',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            <Icon size={18} />
                            {!collapsed && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    {label}
                                </motion.span>
                            )}
                        </motion.button>
                    );
                })}
            </nav>

            {/* Collapse toggle */}
            <button
                onClick={() => setCollapsed(c => !c)}
                style={{
                    margin: '12px 8px',
                    padding: 8,
                    borderRadius: 10,
                    border: '1px solid var(--border)',
                    background: 'var(--bg-card)',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s',
                    flexShrink: 0,
                }}
            >
                {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
        </motion.aside>
    );
}
