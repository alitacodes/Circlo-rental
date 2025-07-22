import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Trash2, CheckCircle } from 'lucide-react';

// Mock admin check (in real app, check user.role === 'admin')
const isAdmin = (user: any) => user && user.email === 'admin@circlo.com';

const mockReportedListings = [
  {
    id: 'l1',
    title: 'Vintage Camera',
    reason: 'Inappropriate content',
    reporter: 'user1@example.com',
  },
  {
    id: 'l2',
    title: 'Designer Dress',
    reason: 'Spam listing',
    reporter: 'user2@example.com',
  },
];

const mockReportedUsers = [
  {
    id: 'u1',
    name: 'John Doe',
    reason: 'Abusive messages',
    reporter: 'user3@example.com',
  },
];

const mockReportedProblems = [
  {
    id: 'p1',
    type: 'Booking',
    description: 'User claims item was not as described',
    reportedBy: 'user4@example.com',
    relatedId: 'b1',
  },
  {
    id: 'p2',
    type: 'Listing',
    description: 'Listing photo is misleading',
    reportedBy: 'user5@example.com',
    relatedId: 'l2',
  },
];

const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const [reportedListings, setReportedListings] = useState(mockReportedListings);
  const [reportedUsers, setReportedUsers] = useState(mockReportedUsers);
  const [reportedProblems, setReportedProblems] = useState(mockReportedProblems);
  const [resolvingProblemId, setResolvingProblemId] = useState<string | null>(null);
  const [problemResolutions, setProblemResolutions] = useState<{[id: string]: string}>({});
  const [selectedAction, setSelectedAction] = useState('');
  const mockActions = [
    'Contacted user',
    'Removed listing',
    'Issued warning',
    'Refunded payment',
    'No action needed',
  ];

  if (!user || !isAdmin(user)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">You do not have permission to view this page.</p>
          <Link to="/" className="text-blue-600 hover:text-blue-700">Go Home</Link>
        </div>
      </div>
    );
  }

  const resolveListing = (id: string) => {
    setReportedListings(listings => listings.filter(l => l.id !== id));
  };
  const resolveUser = (id: string) => {
    setReportedUsers(users => users.filter(u => u.id !== id));
  };
  const resolveProblem = (id: string) => {
    if (!selectedAction) return;
    setProblemResolutions(r => ({ ...r, [id]: selectedAction }));
    setResolvingProblemId(null);
    setSelectedAction('');
    // Optionally, remove from open problems:
    // setReportedProblems(problems => problems.filter(p => p.id !== id));
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Reported Listings</h2>
        {reportedListings.length === 0 ? (
          <div className="text-gray-500">No reported listings.</div>
        ) : (
          <ul className="space-y-3">
            {reportedListings.map(listing => (
              <li key={listing.id} className="bg-white border rounded p-4 flex items-center justify-between">
                <div>
                  <div className="font-medium">{listing.title}</div>
                  <div className="text-sm text-gray-500">Reason: {listing.reason}</div>
                  <div className="text-xs text-gray-400">Reported by: {listing.reporter}</div>
                </div>
                <button
                  className="ml-4 flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                  onClick={() => resolveListing(listing.id)}
                >
                  <CheckCircle className="w-4 h-4" /> Resolve
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Reported Users</h2>
        {reportedUsers.length === 0 ? (
          <div className="text-gray-500">No reported users.</div>
        ) : (
          <ul className="space-y-3">
            {reportedUsers.map(user => (
              <li key={user.id} className="bg-white border rounded p-4 flex items-center justify-between">
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-gray-500">Reason: {user.reason}</div>
                  <div className="text-xs text-gray-400">Reported by: {user.reporter}</div>
                </div>
                <button
                  className="ml-4 flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                  onClick={() => resolveUser(user.id)}
                >
                  <CheckCircle className="w-4 h-4" /> Resolve
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Reported Problems Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Reported Problems</h2>
        {reportedProblems.length === 0 ? (
          <div className="text-gray-500">No reported problems.</div>
        ) : (
          <ul className="space-y-3">
            {reportedProblems.map(problem => (
              <li key={problem.id} className="bg-white border rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="font-medium">{problem.type} Issue</div>
                  <div className="text-sm text-gray-500">{problem.description}</div>
                  <div className="text-xs text-gray-400">Reported by: {problem.reportedBy}</div>
                  <div className="text-xs text-gray-400">Related ID: {problem.relatedId}</div>
                  {problemResolutions[problem.id] && (
                    <div className="mt-2 text-green-700 text-sm">Resolved: {problemResolutions[problem.id]}</div>
                  )}
                </div>
                {!problemResolutions[problem.id] && (
                  <div className="mt-4 md:mt-0 md:ml-4 flex flex-col gap-2">
                    {resolvingProblemId === problem.id ? (
                      <>
                        <select
                          className="border rounded px-2 py-1"
                          value={selectedAction}
                          onChange={e => setSelectedAction(e.target.value)}
                        >
                          <option value="">Select action...</option>
                          {mockActions.map(action => (
                            <option key={action} value={action}>{action}</option>
                          ))}
                        </select>
                        <button
                          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                          onClick={() => resolveProblem(problem.id)}
                          disabled={!selectedAction}
                        >
                          Confirm
                        </button>
                        <button
                          className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                          onClick={() => { setResolvingProblemId(null); setSelectedAction(''); }}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                        onClick={() => { setResolvingProblemId(problem.id); setSelectedAction(''); }}
                      >
                        <CheckCircle className="w-4 h-4" /> Resolve
                      </button>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminPage; 