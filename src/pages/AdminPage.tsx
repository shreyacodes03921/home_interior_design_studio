import React, { useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { useAuthStore } from '../store/useAuthStore';
import { api } from '../api/client';
import {
  AdminAnalytics,
  Booking,
  Design,
  Service,
  Blog,
  Inquiry,
  User,
} from '../types';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input, Textarea } from '../components/ui/Input';
import { Dialog } from '../components/ui/Dialog';
import {
  Shield,
  LayoutDashboard,
  FolderKanban,
  Calendar,
  Users,
  MessageSquare,
  BookOpen,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  DollarSign,
  Mail,
  Sparkles,
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { addToast } = useAppStore();
  const { user, quickDemoLogin } = useAuthStore();

  const [activeTab, setActiveTab] = useState<'analytics' | 'designs' | 'bookings' | 'inquiries' | 'users' | 'blogs'>('analytics');
  const [stats, setStats] = useState<AdminAnalytics | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [recentEmails, setRecentEmails] = useState<any[]>([]);
  const [designs, setDesigns] = useState<Design[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Design modal state
  const [isDesignModalOpen, setIsDesignModalOpen] = useState(false);
  const [editingDesign, setEditingDesign] = useState<Design | null>(null);
  const [designForm, setDesignForm] = useState({
    title: '',
    category: 'Living Room',
    roomType: 'living-room',
    style: 'Scandinavian Japandi',
    images: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    description: '',
    areaSqFt: 650,
    budgetRange: '$50,000 - $75,000',
    palette: '#EBE5DF, #C7B299, #8C7B6B, #2E2926',
    materials: 'Limewash, White Oak, Dordogne Limestone',
  });

  // Booking Notes modal state
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [selectedBookingForNotes, setSelectedBookingForNotes] = useState<Booking | null>(null);
  const [designerNotesInput, setDesignerNotesInput] = useState('');

  // Blog modal state
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [blogForm, setBlogForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
    tags: 'Quiet Luxury, Architecture',
    readTimeMinutes: 5,
  });

  const loadData = () => {
    setIsLoading(true);
    Promise.all([
      api.admin.getAnalytics(),
      api.designs.getAll(),
      api.bookings.getAll(),
      api.inquiries.getAll(),
      api.admin.getUsers(),
      api.blogs.getAll(),
    ])
      .then(([analyticsRes, designsRes, bookingsRes, inquiriesRes, usersRes, blogsRes]) => {
        if (analyticsRes.success) {
          setStats(analyticsRes.stats);
          setRecentBookings(analyticsRes.recentBookings);
          setRecentEmails(analyticsRes.recentEmails || []);
        }
        if (designsRes.success) setDesigns(designsRes.designs);
        if (bookingsRes.success) setBookings(bookingsRes.bookings);
        if (inquiriesRes.success) setInquiries(inquiriesRes.inquiries);
        if (usersRes.success) setUsers(usersRes.users);
        if (blogsRes.success) setBlogs(blogsRes.blogs);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      loadData();
    }
  }, [user]);

  // If user is not an admin, provide access gate with quick switch
  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-xl mx-auto py-24 px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center mx-auto">
          <Shield className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="font-serif text-3xl text-stone-900">Principal Director Access Required</h2>
          <p className="text-xs text-stone-600 leading-relaxed max-w-md mx-auto">
            The studio administrative panel allows managing portfolio works, client consultations, financial pipeline analytics, and publication CMS.
          </p>
        </div>
        <div className="pt-2">
          <Button
            variant="luxury"
            onClick={async () => {
              await quickDemoLogin('admin');
              addToast({ type: 'success', title: 'Admin mode active', description: 'Signed in as Eleanor Vance' });
            }}
            className="uppercase text-xs tracking-wider"
          >
            <Sparkles className="w-4 h-4 mr-1.5" /> Sign In as Admin (Eleanor Vance)
          </Button>
        </div>
      </div>
    );
  }

  // Handle Design Save
  const handleSaveDesign = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: Partial<Design> = {
        title: designForm.title,
        category: designForm.category,
        roomType: designForm.roomType,
        style: designForm.style,
        images: designForm.images.split(',').map((s) => s.trim()),
        description: designForm.description,
        areaSqFt: Number(designForm.areaSqFt) || undefined,
        budgetRange: designForm.budgetRange,
        palette: designForm.palette.split(',').map((s) => s.trim()),
        materials: designForm.materials.split(',').map((s) => s.trim()),
      };

      if (editingDesign) {
        const res = await api.designs.update(editingDesign.id, payload);
        if (res.success) {
          addToast({ type: 'success', title: 'Project updated successfully' });
        }
      } else {
        const res = await api.designs.create(payload);
        if (res.success) {
          addToast({ type: 'success', title: 'New project added to portfolio' });
        }
      }
      setIsDesignModalOpen(false);
      setEditingDesign(null);
      loadData();
    } catch (err: any) {
      addToast({ type: 'error', title: 'Could not save project', description: err.message });
    }
  };

  // Handle Design Delete
  const handleDeleteDesign = async (id: string) => {
    if (!confirm('Are you sure you wish to delete this portfolio residence?')) return;
    try {
      const res = await api.designs.delete(id);
      if (res.success) {
        addToast({ type: 'info', title: 'Project removed from portfolio' });
        loadData();
      }
    } catch (err: any) {
      addToast({ type: 'error', title: 'Failed to delete', description: err.message });
    }
  };

  // Handle Booking Status Update
  const handleUpdateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const res = await api.bookings.updateStatus(bookingId, { status });
      if (res.success) {
        addToast({ type: 'success', title: `Consultation marked as ${status}` });
        loadData();
      }
    } catch (err: any) {
      addToast({ type: 'error', title: 'Update failed', description: err.message });
    }
  };

  // Handle Designer Notes Save
  const handleSaveDesignerNotes = async () => {
    if (!selectedBookingForNotes) return;
    try {
      const res = await api.bookings.updateStatus(selectedBookingForNotes.id, {
        designerNotes: designerNotesInput,
      });
      if (res.success) {
        addToast({ type: 'success', title: 'Designer notes updated' });
        setIsNotesModalOpen(false);
        loadData();
      }
    } catch (err: any) {
      addToast({ type: 'error', title: 'Update failed', description: err.message });
    }
  };

  // Handle Inquiry Status
  const handleUpdateInquiryStatus = async (id: string, status: 'new' | 'contacted' | 'resolved') => {
    try {
      const res = await api.inquiries.updateStatus(id, status);
      if (res.success) {
        addToast({ type: 'success', title: `Inquiry marked as ${status}` });
        loadData();
      }
    } catch (err: any) {
      addToast({ type: 'error', title: 'Update failed', description: err.message });
    }
  };

  // Handle User Status Toggle
  const handleToggleUserStatus = async (u: User) => {
    const nextStatus = u.status === 'active' ? 'deactivated' : 'active';
    try {
      const res = await api.admin.updateUser(u.id, { status: nextStatus });
      if (res.success) {
        addToast({ type: 'info', title: `User ${u.name} set to ${nextStatus}` });
        loadData();
      }
    } catch (err: any) {
      addToast({ type: 'error', title: 'User update failed', description: err.message });
    }
  };

  // Handle User Role Toggle
  const handleToggleUserRole = async (u: User) => {
    const nextRole = u.role === 'admin' ? 'user' : 'admin';
    try {
      const res = await api.admin.updateUser(u.id, { role: nextRole });
      if (res.success) {
        addToast({ type: 'success', title: `${u.name} role updated to ${nextRole}` });
        loadData();
      }
    } catch (err: any) {
      addToast({ type: 'error', title: 'Role update failed', description: err.message });
    }
  };

  // Handle Blog Post Creation
  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const slug = blogForm.slug || blogForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const res = await api.blogs.create({
        ...blogForm,
        slug,
        tags: blogForm.tags.split(',').map((s) => s.trim()),
      });
      if (res.success) {
        addToast({ type: 'success', title: 'New essay published in Journal' });
        setIsBlogModalOpen(false);
        loadData();
      }
    } catch (err: any) {
      addToast({ type: 'error', title: 'Failed to publish essay', description: err.message });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Admin Top Header */}
      <div className="bg-stone-900 text-stone-100 p-8 rounded-2xl border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-300" />
            <span className="text-xs uppercase tracking-widest text-amber-200 font-semibold">
              Studio Executive Dashboard
            </span>
          </div>
          <h1 className="font-serif text-3xl font-light text-white">Atelier Luxe Administration</h1>
          <p className="text-xs text-stone-400 font-light">
            Signed in as Eleanor Vance (Creative Director & Principal Architect)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="luxury"
            size="sm"
            onClick={() => {
              setEditingDesign(null);
              setDesignForm({
                title: '',
                category: 'Living Room',
                roomType: 'living-room',
                style: 'Scandinavian Japandi',
                images: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
                description: '',
                areaSqFt: 650,
                budgetRange: '$50,000 - $75,000',
                palette: '#EBE5DF, #C7B299, #8C7B6B, #2E2926',
                materials: 'Limewash, White Oak, Dordogne Limestone',
              });
              setIsDesignModalOpen(true);
            }}
            className="uppercase text-xs tracking-wider"
          >
            <Plus className="w-4 h-4 mr-1" /> New Project
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsBlogModalOpen(true)}
            className="border-stone-700 text-stone-200 hover:text-white uppercase text-xs tracking-wider"
          >
            <BookOpen className="w-4 h-4 mr-1" /> New Essay
          </Button>
        </div>
      </div>

      {/* Admin Tab Navigation */}
      <div className="flex border-b border-stone-200 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'analytics', label: 'Analytics & Pipeline', icon: LayoutDashboard },
          { id: 'designs', label: `Portfolio CMS (${designs.length})`, icon: FolderKanban },
          { id: 'bookings', label: `Consultations (${bookings.length})`, icon: Calendar },
          { id: 'inquiries', label: `Client Messages (${inquiries.length})`, icon: MessageSquare },
          { id: 'users', label: `Users & Roles (${users.length})`, icon: Users },
          { id: 'blogs', label: `Journal CMS (${blogs.length})`, icon: BookOpen },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-3 text-xs uppercase tracking-wider font-semibold cursor-pointer border-b-2 whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'border-stone-900 text-stone-900'
                  : 'border-transparent text-stone-400 hover:text-stone-700'
              }`}
            >
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* 1. ANALYTICS TAB */}
      {activeTab === 'analytics' && stats && (
        <div className="space-y-8">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-white rounded-xl border border-stone-200 space-y-2 shadow-2xs">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-stone-400">
                Pipeline Value
              </span>
              <p className="font-serif text-3xl font-medium text-stone-900">
                ${(stats.estimatedPipeline || 0).toLocaleString()}
              </p>
              <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> High-intent architectural leads
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl border border-stone-200 space-y-2 shadow-2xs">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-stone-400">
                Total Consultations
              </span>
              <p className="font-serif text-3xl font-medium text-stone-900">
                {stats.totalBookings}
              </p>
              <p className="text-[11px] text-stone-500 font-mono">
                {stats.bookingStatusCounts.confirmed} confirmed • {stats.bookingStatusCounts.pending} pending
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl border border-stone-200 space-y-2 shadow-2xs">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-stone-400">
                Portfolio Residences
              </span>
              <p className="font-serif text-3xl font-medium text-stone-900">
                {stats.totalDesigns}
              </p>
              <p className="text-[11px] text-stone-500 font-mono">
                Across 6 spatial categories
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl border border-stone-200 space-y-2 shadow-2xs">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-stone-400">
                Client Inquiries
              </span>
              <p className="font-serif text-3xl font-medium text-stone-900">
                {stats.totalInquiries}
              </p>
              <p className="text-[11px] text-stone-500 font-mono">
                {inquiries.filter((i) => i.status === 'new').length} require response
              </p>
            </div>
          </div>

          {/* Style Views & Category Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4">
              <h3 className="font-serif text-xl font-medium text-stone-900">
                Most Viewed Architectural Styles
              </h3>
              <div className="space-y-3">
                {Object.entries(stats.styleViews || {}).map(([style, count]) => (
                  <div key={style} className="space-y-1">
                    <div className="flex justify-between text-xs font-mono text-stone-700">
                      <span>{style}</span>
                      <span>{count} portfolio views</span>
                    </div>
                    <div className="w-full bg-stone-100 rounded-full h-2">
                      <div
                        className="bg-amber-900 h-2 rounded-full transition-all"
                        style={{ width: `${Math.min(100, Math.max(15, count / 5))}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Nodemailer Automated Email Activity Log */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4">
              <div className="flex items-center gap-2 text-stone-900">
                <Mail className="w-5 h-5 text-amber-800" />
                <h3 className="font-serif text-xl font-medium">Nodemailer Dispatch Activity</h3>
              </div>
              <p className="text-xs text-stone-500 font-light">
                Automated consultation confirmation receipts and director notifications dispatched by the server.
              </p>
              <div className="space-y-3 max-h-72 overflow-y-auto">
                {recentEmails.length === 0 ? (
                  <p className="text-xs text-stone-400 italic py-4">No recent email dispatches.</p>
                ) : (
                  recentEmails.map((em, i) => (
                    <div key={i} className="p-3 bg-stone-50 rounded-lg border border-stone-200/80 text-xs space-y-1">
                      <div className="flex items-center justify-between text-stone-500 font-mono text-[10px]">
                        <span>To: {em.to}</span>
                        <span>{new Date(em.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <p className="font-medium text-stone-900">{em.subject}</p>
                      <span className="inline-block text-[10px] text-emerald-700 font-semibold">
                        Status: Dispatched & Logged
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. DESIGNS MANAGEMENT TAB */}
      {activeTab === 'designs' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-serif text-2xl font-light text-stone-900">Curated Portfolio Database</h3>
            <Button
              variant="luxury"
              size="sm"
              onClick={() => {
                setEditingDesign(null);
                setIsDesignModalOpen(true);
              }}
              className="uppercase text-xs tracking-wider"
            >
              <Plus className="w-4 h-4 mr-1" /> Add New Project
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {designs.map((design) => (
              <div
                key={design.id}
                className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs flex flex-col justify-between"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
                  <img src={design.images[0]} alt={design.title} className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2">
                    <Badge variant="luxury">{design.category}</Badge>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[10px] font-mono text-stone-400 uppercase">{design.style}</span>
                    <h4 className="font-serif text-lg font-medium text-stone-900">{design.title}</h4>
                    <p className="text-xs text-stone-600 line-clamp-2 font-light mt-1">
                      {design.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-xs font-mono text-stone-500">{design.areaSqFt} sq ft</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingDesign(design);
                          setDesignForm({
                            title: design.title,
                            category: design.category,
                            roomType: design.roomType,
                            style: design.style,
                            images: design.images.join(', '),
                            description: design.description,
                            areaSqFt: design.areaSqFt || 600,
                            budgetRange: design.budgetRange || '',
                            palette: design.palette?.join(', ') || '',
                            materials: design.materials?.join(', ') || '',
                          });
                          setIsDesignModalOpen(true);
                        }}
                        className="p-1.5 text-stone-600 hover:text-stone-900 rounded hover:bg-stone-100 cursor-pointer"
                        title="Edit Project"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteDesign(design.id)}
                        className="p-1.5 text-rose-600 hover:text-rose-800 rounded hover:bg-rose-50 cursor-pointer"
                        title="Delete Project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. BOOKINGS MANAGEMENT TAB */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          <h3 className="font-serif text-2xl font-light text-stone-900">Client Consultations Roster</h3>

          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-stone-50 uppercase tracking-wider text-[10px] text-stone-500 font-semibold border-b border-stone-200">
                  <tr>
                    <th className="px-6 py-4">Client Name</th>
                    <th className="px-6 py-4">Design Offering</th>
                    <th className="px-6 py-4">Date & Time</th>
                    <th className="px-6 py-4">Est. Budget</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Director Notes</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-stone-50/50">
                      <td className="px-6 py-4 font-medium text-stone-900">
                        <p>{b.userName}</p>
                        <p className="text-[10px] text-stone-400 font-mono">{b.userEmail}</p>
                      </td>
                      <td className="px-6 py-4">{b.serviceName}</td>
                      <td className="px-6 py-4 font-mono">
                        <p>{b.date}</p>
                        <p className="text-[10px] text-stone-400">{b.timeSlot || 'Scheduled'}</p>
                      </td>
                      <td className="px-6 py-4 font-mono text-stone-900">{b.budget || 'Custom Scope'}</td>
                      <td className="px-6 py-4">
                        <select
                          value={b.status}
                          onChange={(e) => handleUpdateBookingStatus(b.id, e.target.value)}
                          className="px-2 py-1 bg-stone-50 border border-stone-300 rounded text-xs font-semibold focus:outline-none"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 max-w-xs truncate text-stone-500 font-light">
                        {b.designerNotes || 'No notes added'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedBookingForNotes(b);
                            setDesignerNotesInput(b.designerNotes || '');
                            setIsNotesModalOpen(true);
                          }}
                          className="text-xs uppercase tracking-wider font-semibold text-amber-900 hover:underline cursor-pointer"
                        >
                          Edit Notes
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. INQUIRIES MANAGEMENT TAB */}
      {activeTab === 'inquiries' && (
        <div className="space-y-6">
          <h3 className="font-serif text-2xl font-light text-stone-900">Client Inquiries & Briefs</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {inquiries.map((inq) => (
              <div key={inq.id} className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <div>
                    <h4 className="font-serif text-lg font-medium text-stone-900">{inq.name}</h4>
                    <p className="text-xs font-mono text-stone-500">{inq.email} • {inq.phone || 'No phone'}</p>
                  </div>
                  <Badge variant={inq.status === 'new' ? 'warning' : inq.status === 'contacted' ? 'luxury' : 'success'}>
                    {inq.status}
                  </Badge>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-400">
                    Subject: {inq.subject}
                  </span>
                  <p className="text-xs text-stone-700 leading-relaxed bg-stone-50 p-3 rounded-lg border border-stone-200/60">
                    "{inq.message}"
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[10px] font-mono text-stone-400">
                    Received {new Date(inq.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUpdateInquiryStatus(inq.id, 'contacted')}
                      className="px-2.5 py-1 text-xs rounded border border-stone-300 hover:bg-stone-50 cursor-pointer"
                    >
                      Mark Contacted
                    </button>
                    <button
                      onClick={() => handleUpdateInquiryStatus(inq.id, 'resolved')}
                      className="px-2.5 py-1 text-xs rounded bg-stone-900 text-stone-50 hover:bg-stone-800 cursor-pointer"
                    >
                      Resolve
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. USERS & ROLES TAB */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <h3 className="font-serif text-2xl font-light text-stone-900">User Access & Role Permissions</h3>

          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-stone-50 uppercase tracking-wider text-[10px] text-stone-500 font-semibold border-b border-stone-200">
                <tr>
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Joined</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-stone-50/50">
                    <td className="px-6 py-4 flex items-center gap-3 font-medium text-stone-900">
                      <img
                        src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                        alt={u.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span>{u.name}</span>
                    </td>
                    <td className="px-6 py-4 font-mono">{u.email}</td>
                    <td className="px-6 py-4">
                      <Badge variant={u.role === 'admin' ? 'luxury' : 'default'}>{u.role}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={u.status === 'active' ? 'success' : 'outline'}>{u.status}</Badge>
                    </td>
                    <td className="px-6 py-4 font-mono text-stone-500">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleToggleUserRole(u)}
                        className="text-xs text-amber-900 hover:underline font-semibold cursor-pointer"
                      >
                        {u.role === 'admin' ? 'Set as Client' : 'Make Admin'}
                      </button>
                      <span>•</span>
                      <button
                        onClick={() => handleToggleUserStatus(u)}
                        className="text-xs text-rose-700 hover:underline cursor-pointer"
                      >
                        {u.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. JOURNAL CMS TAB */}
      {activeTab === 'blogs' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-2xl font-light text-stone-900">Studio Journal Publications</h3>
            <Button
              variant="luxury"
              size="sm"
              onClick={() => setIsBlogModalOpen(true)}
              className="uppercase text-xs tracking-wider"
            >
              <Plus className="w-4 h-4 mr-1" /> New Article
            </Button>
          </div>

          <div className="space-y-4">
            {blogs.map((b) => (
              <div key={b.id} className="bg-white p-6 rounded-2xl border border-stone-200 flex items-center justify-between gap-4 shadow-2xs">
                <div className="flex items-center gap-4">
                  <img src={b.coverImage} alt={b.title} className="w-20 h-14 rounded-lg object-cover" />
                  <div>
                    <h4 className="font-serif text-lg font-medium text-stone-900">{b.title}</h4>
                    <p className="text-xs text-stone-500 font-mono">By {b.author.name} • {b.publishedDate}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge variant="neutral">{b.tags.join(', ')}</Badge>
                  <button
                    onClick={async () => {
                      if (!confirm('Delete this essay?')) return;
                      await api.blogs.delete(b.id);
                      addToast({ type: 'info', title: 'Essay removed' });
                      loadData();
                    }}
                    className="p-1.5 text-rose-600 hover:text-rose-800 rounded hover:bg-rose-50 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DESIGN EDIT/CREATE MODAL */}
      <Dialog
        isOpen={isDesignModalOpen}
        onClose={() => setIsDesignModalOpen(false)}
        maxWidth="xl"
        title={editingDesign ? 'Edit Portfolio Residence' : 'Commission New Portfolio Work'}
      >
        <form onSubmit={handleSaveDesign} className="space-y-4">
          <Input
            label="Project Title"
            value={designForm.title}
            onChange={(e) => setDesignForm({ ...designForm, title: e.target.value })}
            placeholder="e.g. Kyoto Minimalist Villa"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                Room Category
              </label>
              <select
                value={designForm.roomType}
                onChange={(e) => setDesignForm({ ...designForm, roomType: e.target.value, category: e.target.options[e.target.selectedIndex].text })}
                className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-800"
              >
                <option value="living-room">Living Room</option>
                <option value="bedroom">Bedroom</option>
                <option value="kitchen">Kitchen</option>
                <option value="office">Office</option>
                <option value="bathroom">Bathroom</option>
                <option value="dining-room">Dining Room</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                Architectural Style
              </label>
              <select
                value={designForm.style}
                onChange={(e) => setDesignForm({ ...designForm, style: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-800"
              >
                <option value="Scandinavian Japandi">Scandinavian Japandi</option>
                <option value="Contemporary Luxury">Contemporary Luxury</option>
                <option value="Modern Minimalist">Modern Minimalist</option>
                <option value="Mid-Century Modern">Mid-Century Modern</option>
                <option value="Warm Mediterranean">Warm Mediterranean</option>
                <option value="Traditional Elegant">Traditional Elegant</option>
              </select>
            </div>
          </div>

          <Input
            label="Image URLs (comma separated)"
            value={designForm.images}
            onChange={(e) => setDesignForm({ ...designForm, images: e.target.value })}
            placeholder="https://images.unsplash.com/..., https://..."
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Area Square Footage"
              type="number"
              value={designForm.areaSqFt}
              onChange={(e) => setDesignForm({ ...designForm, areaSqFt: Number(e.target.value) })}
            />
            <Input
              label="Investment Range"
              value={designForm.budgetRange}
              onChange={(e) => setDesignForm({ ...designForm, budgetRange: e.target.value })}
              placeholder="$50,000 - $75,000"
            />
          </div>

          <Input
            label="Hex Color Palette (comma separated)"
            value={designForm.palette}
            onChange={(e) => setDesignForm({ ...designForm, palette: e.target.value })}
            placeholder="#EBE5DF, #C7B299, #2E2926"
          />

          <Input
            label="Materials List (comma separated)"
            value={designForm.materials}
            onChange={(e) => setDesignForm({ ...designForm, materials: e.target.value })}
            placeholder="Limewash, White Oak, Dordogne Limestone"
          />

          <Textarea
            label="Project Description & Concept"
            value={designForm.description}
            onChange={(e) => setDesignForm({ ...designForm, description: e.target.value })}
            rows={4}
            required
          />

          <div className="flex justify-end gap-3 pt-3">
            <Button type="button" variant="ghost" onClick={() => setIsDesignModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="luxury" className="uppercase text-xs tracking-wider">
              {editingDesign ? 'Update Project' : 'Publish Project'}
            </Button>
          </div>
        </form>
      </Dialog>

      {/* DESIGNER NOTES MODAL */}
      <Dialog
        isOpen={isNotesModalOpen}
        onClose={() => setIsNotesModalOpen(false)}
        maxWidth="md"
        title="Consultation Director Notes"
        description="These notes will appear directly in the client's consultation dashboard."
      >
        <div className="space-y-4">
          <Textarea
            label="Internal & Client-Facing Notes"
            value={designerNotesInput}
            onChange={(e) => setDesignerNotesInput(e.target.value)}
            rows={4}
            placeholder="e.g. Prepared 3D finish schedule. Assigned to Marcus Lindqvist for site visit on Monday."
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setIsNotesModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="luxury" onClick={handleSaveDesignerNotes} className="uppercase text-xs tracking-wider">
              Save Notes
            </Button>
          </div>
        </div>
      </Dialog>

      {/* BLOG POST CREATION MODAL */}
      <Dialog
        isOpen={isBlogModalOpen}
        onClose={() => setIsBlogModalOpen(false)}
        maxWidth="lg"
        title="Compose Studio Journal Essay"
      >
        <form onSubmit={handleSaveBlog} className="space-y-4">
          <Input
            label="Essay Title"
            value={blogForm.title}
            onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
            placeholder="e.g. The Architecture of Silence"
            required
          />
          <Input
            label="Cover Image URL"
            value={blogForm.coverImage}
            onChange={(e) => setBlogForm({ ...blogForm, coverImage: e.target.value })}
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Topic Tags (comma separated)"
              value={blogForm.tags}
              onChange={(e) => setBlogForm({ ...blogForm, tags: e.target.value })}
              placeholder="Quiet Luxury, Materials"
            />
            <Input
              label="Est. Read Time (minutes)"
              type="number"
              value={blogForm.readTimeMinutes}
              onChange={(e) => setBlogForm({ ...blogForm, readTimeMinutes: Number(e.target.value) })}
            />
          </div>
          <Textarea
            label="Excerpt Summary"
            value={blogForm.excerpt}
            onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
            rows={2}
            required
          />
          <Textarea
            label="Markdown / Formatted Essay Content"
            value={blogForm.content}
            onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
            rows={6}
            placeholder="Write essay paragraphs. Use ## for section headings and > for quotes."
            required
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setIsBlogModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="luxury" className="uppercase text-xs tracking-wider">
              Publish Essay
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};
