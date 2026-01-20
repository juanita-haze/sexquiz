'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface ReferralCode {
  id: string;
  code: string;
  influencer_name: string;
  discount_percent: number;
  is_active: boolean;
  created_at: string;
  total_uses: number;
  total_paid: number;
  total_revenue: number;
}

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [referrals, setReferrals] = useState<ReferralCode[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Form state for new/edit referral
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formCode, setFormCode] = useState('');
  const [formInfluencer, setFormInfluencer] = useState('');
  const [formDiscount, setFormDiscount] = useState(0);

  const fetchReferrals = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/referrals', {
        headers: {
          Authorization: `Bearer ${password}`,
        },
      });

      if (response.status === 401) {
        setIsAuthenticated(false);
        setError('Invalid password');
        return;
      }

      const data = await response.json();

      if (data.error) {
        setError(data.error);
        return;
      }

      setReferrals(data.referrals || []);
      setIsAuthenticated(true);
    } catch (err) {
      console.error('Error fetching referrals:', err);
      setError('Error loading data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    fetchReferrals();
  };

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const method = editingId ? 'PUT' : 'POST';
      const body = editingId
        ? { id: editingId, code: formCode, influencer_name: formInfluencer, discount_percent: formDiscount }
        : { code: formCode, influencer_name: formInfluencer, discount_percent: formDiscount };

      const response = await fetch('/api/admin/referrals', {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${password}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.error) {
        alert(data.error);
        return;
      }

      // Reset form and refresh
      setShowForm(false);
      setEditingId(null);
      setFormCode('');
      setFormInfluencer('');
      setFormDiscount(0);
      fetchReferrals();
    } catch (err) {
      console.error('Error saving referral:', err);
      alert('Error saving referral');
    }
  };

  const handleToggleActive = async (referral: ReferralCode) => {
    try {
      const response = await fetch('/api/admin/referrals', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${password}`,
        },
        body: JSON.stringify({
          id: referral.id,
          is_active: !referral.is_active,
        }),
      });

      if (response.ok) {
        fetchReferrals();
      }
    } catch (err) {
      console.error('Error toggling active:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this referral code?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/referrals?id=${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${password}`,
        },
      });

      if (response.ok) {
        fetchReferrals();
      }
    } catch (err) {
      console.error('Error deleting referral:', err);
    }
  };

  const handleEdit = (referral: ReferralCode) => {
    setEditingId(referral.id);
    setFormCode(referral.code);
    setFormInfluencer(referral.influencer_name);
    setFormDiscount(referral.discount_percent);
    setShowForm(true);
  };

  const formatCurrency = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  // Calculate totals
  const totalUses = referrals.reduce((sum, r) => sum + r.total_uses, 0);
  const totalPaid = referrals.reduce((sum, r) => sum + r.total_paid, 0);
  const totalRevenue = referrals.reduce((sum, r) => sum + r.total_revenue, 0);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-gray-50 px-4">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              🔐 Admin Login
            </h1>

            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-sm text-gray-600 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Enter admin password"
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm mb-4">{error}</p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 bg-[#C76B6B] text-white rounded-lg hover:bg-[#A85555] disabled:opacity-50"
              >
                {isLoading ? 'Loading...' : 'Login'}
              </button>
            </form>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-gray-800">
              📊 Referral Code Management
            </h1>
            <button
              onClick={() => {
                setShowForm(true);
                setEditingId(null);
                setFormCode('');
                setFormInfluencer('');
                setFormDiscount(0);
              }}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              + New Code
            </button>
          </div>

          {/* Stats Summary */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 shadow border border-gray-200">
              <p className="text-gray-500 text-sm">Total Codes</p>
              <p className="text-2xl font-bold text-gray-800">{referrals.length}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow border border-gray-200">
              <p className="text-gray-500 text-sm">Total Uses</p>
              <p className="text-2xl font-bold text-gray-800">{totalUses}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow border border-gray-200">
              <p className="text-gray-500 text-sm">Paid Conversions</p>
              <p className="text-2xl font-bold text-gray-800">{totalPaid}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow border border-gray-200">
              <p className="text-gray-500 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenue)}</p>
            </div>
          </div>

          {/* Create/Edit Form */}
          {showForm && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                {editingId ? 'Edit Referral Code' : 'Create New Referral Code'}
              </h2>

              <form onSubmit={handleCreateOrUpdate}>
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Code *
                    </label>
                    <input
                      type="text"
                      value={formCode}
                      onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg uppercase"
                      placeholder="INFLUENCER10"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Influencer Name *
                    </label>
                    <input
                      type="text"
                      value={formInfluencer}
                      onChange={(e) => setFormInfluencer(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Discount %
                    </label>
                    <input
                      type="number"
                      value={formDiscount}
                      onChange={(e) => setFormDiscount(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      min="0"
                      max="100"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#C76B6B] text-white rounded-lg hover:bg-[#A85555]"
                  >
                    {editingId ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Referrals Table */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Code</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Influencer</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Discount</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Status</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Uses</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Paid</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Revenue</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {referrals.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-gray-500">
                      No referral codes yet. Create your first one!
                    </td>
                  </tr>
                ) : (
                  referrals.map((referral) => (
                    <tr key={referral.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <span className="font-mono font-bold text-[#C76B6B]">
                          {referral.code}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {referral.influencer_name}
                      </td>
                      <td className="px-4 py-3">
                        {referral.discount_percent > 0 ? (
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm">
                            {referral.discount_percent}% off
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleToggleActive(referral)}
                          className={`px-2 py-1 rounded text-sm ${
                            referral.is_active
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {referral.is_active ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {referral.total_uses}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {referral.total_paid}
                      </td>
                      <td className="px-4 py-3 font-medium text-green-600">
                        {formatCurrency(referral.total_revenue)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(referral)}
                            className="text-blue-500 hover:text-blue-700 text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(referral.id)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
