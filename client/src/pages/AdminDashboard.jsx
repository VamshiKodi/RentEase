import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';
import { PageLoader } from '../components/Loader';
import adminAxios from '../api/adminAxios';

const STATUSES = ['pending', 'approved', 'rejected'];

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState([]);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [reviewingId, setReviewingId] = useState(null);

  const fetchProperties = async (status = statusFilter) => {
    try {
      setLoading(true);
      const response = await adminAxios.get('/api/admin/properties', {
        params: { status },
      });
      setProperties(response.data.properties || []);
    } catch (error) {
      console.error('Error fetching admin properties:', error);
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties(statusFilter);
  }, [statusFilter]);

  const handleReview = async (propertyId, action) => {
    const note = window.prompt(
      action === 'approve'
        ? 'Optional note for approval:'
        : 'Reason for rejection (optional):',
      ''
    );

    try {
      setReviewingId(propertyId);
      await adminAxios.patch(`/api/admin/properties/${propertyId}/review`, {
        action,
        note: note || '',
      });
      toast.success(action === 'approve' ? 'Property approved' : 'Property rejected');
      fetchProperties(statusFilter);
    } catch (error) {
      console.error('Error reviewing property:', error);
      toast.error(error.response?.data?.message || 'Failed to update property status');
    } finally {
      setReviewingId(null);
    }
  };

  if (loading) {
    return <PageLoader text="Loading admin dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Admin Dashboard</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">Review owner listings before they go live.</p>
          </div>
          <div className="bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest inline-flex items-center">
            <ShieldCheck className="h-4 w-4 mr-2" />
            Moderation Center
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {STATUSES.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                statusFilter === status
                  ? 'bg-primary-600 text-white'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {status}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
              statusFilter === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
            }`}
          >
            all
          </button>
        </div>

        {properties.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center text-slate-500 dark:text-slate-400">
            No properties found for this filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {properties.map((property) => (
              <div
                key={property._id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{property.title}</h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {property.location?.address}, {property.location?.city}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {property.approvalStatus}
                  </span>
                </div>

                <div className="text-sm text-slate-700 dark:text-slate-300 space-y-1">
                  <p><span className="font-semibold">Owner:</span> {property.owner?.name} ({property.owner?.email})</p>
                  <p><span className="font-semibold">Rent:</span> Rs {property.rent?.toLocaleString?.() ?? property.rent} / month</p>
                  <p><span className="font-semibold">BHK:</span> {property.bhk} | <span className="font-semibold">Type:</span> {property.propertyType}</p>
                </div>

                {!!property.reviewNote && (
                  <div className="mt-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm text-slate-600 dark:text-slate-400">
                    <span className="font-semibold">Last review note:</span> {property.reviewNote}
                  </div>
                )}

                <div className="mt-4 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleReview(property._id, 'approve')}
                    disabled={reviewingId === property._id || property.approvalStatus === 'approved'}
                    className="btn-primary !py-2.5 !px-4 text-sm inline-flex items-center disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-1.5" />
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => handleReview(property._id, 'reject')}
                    disabled={reviewingId === property._id || property.approvalStatus === 'rejected'}
                    className="btn-secondary !py-2.5 !px-4 text-sm inline-flex items-center disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <XCircle className="h-4 w-4 mr-1.5" />
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
