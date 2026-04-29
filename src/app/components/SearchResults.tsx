import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Building2, Ticket, Users, Search, X } from 'lucide-react';

export function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  // Mock data for search results
  const mockCustomers = [
    { id: '1', name: 'Nordic Tech AS', type: 'Kunde', status: 'Aktiv', description: 'SEO & Google Ads - Onboarding' },
    { id: '2', name: 'E-commerce Pro AS', type: 'Kunde', status: 'Aktiv', description: 'Full-service - SEO + Ads' },
    { id: '3', name: 'Digital Solutions AS', type: 'Lead', status: 'Proposal sent', description: 'SEO, Google Ads' }
  ];

  const mockTickets = [
    { id: '1234', subject: 'Spørsmål om rapportdata', customer: 'Nordic Tech AS', status: 'Open', priority: 'Medium' },
    { id: '1235', subject: 'Teknisk støtte - tracking', customer: 'E-commerce Pro AS', status: 'In Progress', priority: 'High' }
  ];

  const mockContacts = [
    { id: '1', name: 'Maria Hansen', title: 'Markedssjef', company: 'Nordic Tech AS', email: 'maria@nordictech.no' },
    { id: '2', name: 'Nina Hansen', title: 'CEO', company: 'E-commerce Pro AS', email: 'nina@ecommercepro.no' },
    { id: '3', name: 'Anders Johnsen', title: 'CTO', company: 'Digital Solutions AS', email: 'anders@digitalsolutions.no' }
  ];

  // Filter results based on query
  const filteredCustomers = query
    ? mockCustomers.filter(c =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.description.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const filteredTickets = query
    ? mockTickets.filter(t =>
        t.subject.toLowerCase().includes(query.toLowerCase()) ||
        t.customer.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const filteredContacts = query
    ? mockContacts.filter(c =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.company.toLowerCase().includes(query.toLowerCase()) ||
        c.email.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const totalResults = filteredCustomers.length + filteredTickets.length + filteredContacts.length;

  if (!query) {
    return (
      <div className="p-6">
        <div className="max-w-2xl mx-auto text-center py-12">
          <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="font-semibold text-slate-900 dark:text-white text-xl mb-2">Søk i CRM</h2>
          <p className="text-slate-600 dark:text-slate-400">Skriv et søkeord for å finne kunder, tickets eller kontakter</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Søkeresultater</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            {totalResults} resultat{totalResults !== 1 ? 'er' : ''} for "{query}"
          </p>
        </div>
        <Link
          to="/"
          className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
        >
          <X className="w-4 h-4" />
          Lukk søk
        </Link>
      </div>

      {totalResults === 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-12 text-center">
          <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Ingen resultater funnet</h3>
          <p className="text-slate-600 dark:text-slate-400">Prøv et annet søkeord eller sjekk stavingen</p>
        </div>
      )}

      {/* Customers Section */}
      {filteredCustomers.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              <h3 className="font-semibold text-slate-900 dark:text-white">Kunder ({filteredCustomers.length})</h3>
            </div>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {filteredCustomers.map((customer) => (
              <Link
                key={customer.id}
                to={customer.type === 'Lead' ? `/leads` : `/customers/${customer.id}`}
                className="px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-4 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900 dark:text-white">{customer.name}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{customer.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-xs font-medium">
                    {customer.type}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    customer.status === 'Aktiv' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {customer.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Tickets Section */}
      {filteredTickets.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <Ticket className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              <h3 className="font-semibold text-slate-900 dark:text-white">Tickets ({filteredTickets.length})</h3>
            </div>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {filteredTickets.map((ticket) => (
              <Link
                key={ticket.id}
                to="/tickets"
                className="px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-4 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
                  <Ticket className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm text-slate-500 dark:text-slate-400">#{ticket.id}</p>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      ticket.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {ticket.priority}
                    </span>
                  </div>
                  <p className="font-medium text-slate-900 dark:text-white">{ticket.subject}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Kunde: {ticket.customer}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  ticket.status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {ticket.status}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Contacts Section */}
      {filteredContacts.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              <h3 className="font-semibold text-slate-900 dark:text-white">Kontaktpersoner ({filteredContacts.length})</h3>
            </div>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                className="px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-4 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                  <Users className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900 dark:text-white">{contact.name}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{contact.title} - {contact.company}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{contact.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
