import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useCurrentUser } from '../contexts/UserContext';
import {
  Users,
  Shield,
  Mail,
  Phone,
  Calendar,
  Trash2,
  Edit,
  Plus,
  X,
  Check,
  AlertCircle,
  Settings as SettingsIcon,
  Bell,
  Lock
} from 'lucide-react';

export function Settings() {
  const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'general'>('users');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [showEditRoleModal, setShowEditRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'selger',
    status: 'active'
  });
  const [newRole, setNewRole] = useState({
    name: '',
    description: '',
    color: 'blue',
    permissions: [] as string[]
  });

  const { user: currentUser, signOut, updateProfile } = useCurrentUser();
  const [users, setUsers] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('selger');
  const [inviting, setInviting] = useState(false);

  // Load users from Supabase profiles
  useEffect(() => {
    supabase.from('profiles').select('*').order('created_at')
      .then(({ data }) => {
        if (data) setUsers(data.map(u => ({
          id: u.id,
          name: u.navn || u.epost?.split('@')[0] || '—',
          email: u.epost || '',
          phone: u.telefon || '',
          role: u.rolle || 'selger',
          status: u.status || 'active',
          lastLogin: u.sist_innlogget ? new Date(u.sist_innlogget).toLocaleDateString('no-NO') : 'Aldri',
          created: u.created_at ? new Date(u.created_at).toLocaleDateString('no-NO') : '—'
        })));
        setUsersLoading(false);
      });
  }, []);

  const handleInviteUser = async () => {
    if (!inviteEmail.trim()) return;
    setInviting(true);

    // Send magic link — creates user in Supabase Auth if not exists
    const { error } = await supabase.auth.signInWithOtp({
      email: inviteEmail,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: window.location.origin,
        data: { rolle: inviteRole }
      }
    });

    if (error) {
      alert('Feil ved sending av invitasjon: ' + error.message);
    } else {
      alert('Invitasjon sendt til ' + inviteEmail + '! De mottar en e-post med innloggingslenke.');
    }

    setInviteEmail('');
    setInviting(false);

    // Reload users
    const { data } = await supabase.from('profiles').select('*').order('created_at');
    if (data) setUsers(data.map(u => ({ id: u.id, name: u.navn || u.epost?.split('@')[0] || '—', email: u.epost || '', phone: u.telefon || '', role: u.rolle || 'selger', status: u.status || 'active', lastLogin: u.sist_innlogget ? new Date(u.sist_innlogget).toLocaleDateString('no-NO') : 'Aldri', created: u.created_at ? new Date(u.created_at).toLocaleDateString('no-NO') : '—' })));
  };

  // TODO: Backend - Fetch roles from database
  const [roles, setRoles] = useState([
    {
      id: 'admin',
      name: 'Administrator',
      description: 'Full tilgang til alle funksjoner og innstillinger',
      color: 'red',
      permissions: [
        'Administrere brukere og roller',
        'Se alle kunder og leads',
        'Redigere alle kunder og oppgaver',
        'Tilgang til alle rapporter',
        'Administrere integrasjoner',
        'Slette data'
      ]
    },
    {
      id: 'salgssjef',
      name: 'Salgssjef',
      description: 'Kan administrere team og se alle salgsdata',
      color: 'purple',
      permissions: [
        'Se alle kunder og leads',
        'Redigere alle kunder og oppgaver',
        'Tildele oppgaver til team',
        'Tilgang til alle rapporter',
        'Administrere pipeline'
      ]
    },
    {
      id: 'selger',
      name: 'Selger',
      description: 'Kan administrere egne kunder og oppgaver',
      color: 'blue',
      permissions: [
        'Se egne kunder og leads',
        'Redigere egne kunder',
        'Opprette og redigere egne oppgaver',
        'Tilgang til prospects og ringeliste',
        'Se egne rapporter'
      ]
    },
    {
      id: 'marketing',
      name: 'Marketing',
      description: 'Kan administrere prospects og kampanjer',
      color: 'green',
      permissions: [
        'Se alle prospects',
        'Administrere ringeliste',
        'Opprette kampanjer',
        'Tilgang til marketing rapporter',
        'Se (ikke redigere) kundekort'
      ]
    }
  ]);

  // Available permissions for role assignment
  const availablePermissions = [
    'Administrere brukere og roller',
    'Se alle kunder og leads',
    'Se egne kunder og leads',
    'Redigere alle kunder og oppgaver',
    'Redigere egne kunder',
    'Opprette og redigere egne oppgaver',
    'Tildele oppgaver til team',
    'Tilgang til alle rapporter',
    'Se egne rapporter',
    'Administrere integrasjoner',
    'Administrere pipeline',
    'Se alle prospects',
    'Administrere ringeliste',
    'Opprette kampanjer',
    'Tilgang til marketing rapporter',
    'Slette data'
  ];

  const getRoleColor = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    switch (role?.color) {
      case 'red': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
      case 'purple': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400';
      case 'blue': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
      case 'green': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      case 'yellow': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400';
      case 'orange': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400';
      case 'pink': return 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400';
      case 'indigo': return 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const getRoleName = (roleId: string) => {
    return roles.find(r => r.id === roleId)?.name || roleId;
  };

  const handleAddUser = async () => {
    // TODO: Backend - Add user to database
    const user = {
      id: (users.length + 1).toString(),
      ...newUser,
      lastLogin: 'Aldri',
      created: new Date().toLocaleDateString('nb-NO', { day: 'numeric', month: 'long', year: 'numeric' })
    };
    setUsers([...users, user]);
    setNewUser({ name: '', email: '', phone: '', role: 'selger', status: 'active' });
    setShowAddUserModal(false);
  };

  const handleDeleteUser = async (userId: string) => {
    // TODO: Backend - Delete user from database
    if (confirm('Er du sikker på at du vil slette denne brukeren?')) {
      await supabase.from('profiles').delete().eq('id', userId);
      setUsers(users.filter(u => u.id !== userId));
    }
  };

  const handleEditUser = async () => {
    // TODO: Backend - Update user in database
    await supabase.from('profiles').update({
      navn: selectedUser.name,
      epost: selectedUser.email,
      telefon: selectedUser.phone,
      rolle: selectedUser.role,
      status: selectedUser.status
    }).eq('id', selectedUser.id);
    setUsers(users.map(u => u.id === selectedUser.id ? selectedUser : u));
    setShowEditUserModal(false);
    setSelectedUser(null);
  };

  const handleAddRole = async () => {
    // TODO: Backend - Add role to database
    const role = {
      id: newRole.name.toLowerCase().replace(/\s+/g, '_'),
      ...newRole
    };
    setRoles([...roles, role]);
    setNewRole({ name: '', description: '', color: 'blue', permissions: [] });
    setShowAddRoleModal(false);
  };

  const handleEditRole = () => {
    // TODO: Backend - Update role in database
    setRoles(roles.map(r => r.id === selectedRole.id ? selectedRole : r));
    setShowEditRoleModal(false);
    setSelectedRole(null);
  };

  const handleDeleteRole = async (roleId: string) => {
    // TODO: Backend - Delete role from database
    if (roleId === 'admin') {
      alert('Administrator-rollen kan ikke slettes');
      return;
    }

    const usersWithRole = users.filter(u => u.role === roleId);
    if (usersWithRole.length > 0) {
      alert(`Kan ikke slette rollen fordi ${usersWithRole.length} bruker(e) har denne rollen. Flytt brukerne til en annen rolle først.`);
      return;
    }

    if (confirm('Er du sikker på at du vil slette denne rollen?')) {
      setRoles(roles.filter(r => r.id !== roleId));
    }
  };

  const togglePermission = (permission: string, isEditMode: boolean = false) => {
    if (isEditMode && selectedRole) {
      const hasPermission = selectedRole.permissions.includes(permission);
      setSelectedRole({
        ...selectedRole,
        permissions: hasPermission
          ? selectedRole.permissions.filter((p: string) => p !== permission)
          : [...selectedRole.permissions, permission]
      });
    } else {
      const hasPermission = newRole.permissions.includes(permission);
      setNewRole({
        ...newRole,
        permissions: hasPermission
          ? newRole.permissions.filter(p => p !== permission)
          : [...newRole.permissions, permission]
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Innstillinger</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Administrer brukere, roller og tilganger</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
          <Shield className="w-4 h-4 text-red-600 dark:text-red-400" />
          <span className="text-sm font-medium text-red-700 dark:text-red-400">Superbruker</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-700">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
              activeTab === 'users'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            Brukere
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
              activeTab === 'roles'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Shield className="w-4 h-4" />
            Roller og tilganger
          </button>
          <button
            onClick={() => setActiveTab('general')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
              activeTab === 'general'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <SettingsIcon className="w-4 h-4" />
            Generelt
          </button>
        </div>
      </div>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-900 dark:text-white">Ansatte ({users.length})</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Administrer ansatte som har tilgang til CRM-systemet
              </p>
            </div>
            <button
              onClick={() => setShowAddUserModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Legg til ansatt
            </button>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                    Navn
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                    Kontakt
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                    Rolle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                    Siste innlogging
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                    Handlinger
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{user.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Medlem siden {user.created}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <Mail className="w-3 h-3" />
                          {user.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <Phone className="w-3 h-3" />
                          {user.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                        {getRoleName(user.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        user.status === 'active'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}>
                        {user.status === 'active' ? 'Aktiv' : 'Inaktiv'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-600 dark:text-slate-400">{user.lastLogin}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedUser({ ...user });
                            setShowEditUserModal(true);
                          }}
                          className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="Rediger"
                        >
                          <Edit className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </button>
                        {user.role !== 'admin' && (
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Slett"
                          >
                            <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Roles Tab */}
      {activeTab === 'roles' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-900 dark:text-white">Roller og tilganger ({roles.length})</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Administrer roller og tilganger i systemet
              </p>
            </div>
            <button
              onClick={() => setShowAddRoleModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Opprett rolle
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {roles.map((role) => (
              <div key={role.id} className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className={`w-5 h-5 ${
                        role.color === 'red' ? 'text-red-600 dark:text-red-400' :
                        role.color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
                        role.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                        role.color === 'green' ? 'text-green-600 dark:text-green-400' :
                        role.color === 'yellow' ? 'text-yellow-600 dark:text-yellow-400' :
                        role.color === 'orange' ? 'text-orange-600 dark:text-orange-400' :
                        role.color === 'pink' ? 'text-pink-600 dark:text-pink-400' :
                        role.color === 'indigo' ? 'text-indigo-600 dark:text-indigo-400' :
                        'text-slate-600 dark:text-slate-400'
                      }`} />
                      <h3 className="font-semibold text-slate-900 dark:text-white">{role.name}</h3>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{role.description}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getRoleColor(role.id)}`}>
                      {users.filter(u => u.role === role.id).length} brukere
                    </span>
                    <button
                      onClick={() => {
                        setSelectedRole({ ...role, permissions: [...role.permissions] });
                        setShowEditRoleModal(true);
                      }}
                      className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                      title="Rediger rolle"
                    >
                      <Edit className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </button>
                    {role.id !== 'admin' && (
                      <button
                        onClick={() => handleDeleteRole(role.id)}
                        className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                        title="Slett rolle"
                      >
                        <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300 uppercase">Tilganger</p>
                  {role.permissions.map((permission, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-600 dark:text-slate-400">{permission}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* General Tab */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Generelle innstillinger</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">E-postvarsler</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Motta e-post ved nye oppgaver</p>
                </div>
                <input type="checkbox" className="w-5 h-5 rounded" defaultChecked />
              </div>
              <div className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">Push-varsler</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Motta push-varsler i nettleseren</p>
                </div>
                <input type="checkbox" className="w-5 h-5 rounded" defaultChecked />
              </div>
              <div className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">Daglig sammendrag</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Motta daglig sammendrag kl. 08:00</p>
                </div>
                <input type="checkbox" className="w-5 h-5 rounded" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Organisasjon</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Organisasjonsnavn
                </label>
                <input
                  type="text"
                  defaultValue="Adseo AS"
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Organisasjonsnummer
                </label>
                <input
                  type="text"
                  defaultValue="123456789"
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full mx-4">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold text-slate-900 dark:text-white">Legg til ny ansatt</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Navn
                </label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="Ola Nordmann"
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  E-post
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="ola@adseo.no"
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Telefon
                </label>
                <input
                  type="tel"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  placeholder="+47 123 45 678"
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Rolle
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg"
                >
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowAddUserModal(false);
                  setNewUser({ name: '', email: '', phone: '', role: 'selger', status: 'active' });
                }}
                className="px-4 py-2 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Avbryt
              </button>
              <button
                onClick={handleAddUser}
                disabled={!newUser.name || !newUser.email}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Legg til ansatt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full mx-4">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold text-slate-900 dark:text-white">Rediger ansatt</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Navn
                </label>
                <input
                  type="text"
                  value={selectedUser.name}
                  onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  E-post
                </label>
                <input
                  type="email"
                  value={selectedUser.email}
                  onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Telefon
                </label>
                <input
                  type="tel"
                  value={selectedUser.phone}
                  onChange={(e) => setSelectedUser({ ...selectedUser, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Rolle
                </label>
                <select
                  value={selectedUser.role}
                  onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg"
                  disabled={selectedUser.role === 'admin'}
                >
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
                {selectedUser.role === 'admin' && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Administrator-rollen kan ikke endres
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Status
                </label>
                <select
                  value={selectedUser.status}
                  onChange={(e) => setSelectedUser({ ...selectedUser, status: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg"
                >
                  <option value="active">Aktiv</option>
                  <option value="inactive">Inaktiv</option>
                </select>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowEditUserModal(false);
                  setSelectedUser(null);
                }}
                className="px-4 py-2 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Avbryt
              </button>
              <button
                onClick={handleEditUser}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Lagre endringer
              </button>
            </div>
          </div>

          {/* Endre passord */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
              <h2 className="font-semibold text-slate-900 dark:text-white">Endre passord</h2>
              <p className="text-sm text-slate-500 mt-0.5">Sett eller oppdater ditt passord</p>
            </div>
            <div className="p-6">
              <ChangePasswordForm />
            </div>
          </div>
        </div>
      )}

      {/* Add Role Modal */}
      {showAddRoleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold text-slate-900 dark:text-white">Opprett ny rolle</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Rollenavn
                </label>
                <input
                  type="text"
                  value={newRole.name}
                  onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                  placeholder="Kundeservice"
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Beskrivelse
                </label>
                <textarea
                  value={newRole.description}
                  onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                  placeholder="Håndterer kundehenvendelser og support"
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Farge
                </label>
                <div className="flex gap-2">
                  {['red', 'purple', 'blue', 'green', 'yellow', 'orange', 'pink', 'indigo'].map((color) => (
                    <button
                      key={color}
                      onClick={() => setNewRole({ ...newRole, color })}
                      className={`w-10 h-10 rounded-lg border-2 transition-all ${
                        newRole.color === color ? 'border-slate-900 dark:border-white scale-110' : 'border-transparent'
                      } ${
                        color === 'red' ? 'bg-red-500' :
                        color === 'purple' ? 'bg-purple-500' :
                        color === 'blue' ? 'bg-blue-500' :
                        color === 'green' ? 'bg-green-500' :
                        color === 'yellow' ? 'bg-yellow-500' :
                        color === 'orange' ? 'bg-orange-500' :
                        color === 'pink' ? 'bg-pink-500' :
                        'bg-indigo-500'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                  Tilganger
                </label>
                <div className="space-y-2 max-h-64 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                  {availablePermissions.map((permission) => (
                    <label
                      key={permission}
                      className="flex items-start gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={newRole.permissions.includes(permission)}
                        onChange={() => togglePermission(permission)}
                        className="mt-0.5 w-4 h-4 rounded"
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-300">{permission}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowAddRoleModal(false);
                  setNewRole({ name: '', description: '', color: 'blue', permissions: [] });
                }}
                className="px-4 py-2 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Avbryt
              </button>
              <button
                onClick={handleAddRole}
                disabled={!newRole.name || newRole.permissions.length === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Opprett rolle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Role Modal */}
      {showEditRoleModal && selectedRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold text-slate-900 dark:text-white">Rediger rolle</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Rollenavn
                </label>
                <input
                  type="text"
                  value={selectedRole.name}
                  onChange={(e) => setSelectedRole({ ...selectedRole, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg"
                  disabled={selectedRole.id === 'admin'}
                />
                {selectedRole.id === 'admin' && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Administrator-rollen kan ikke endres
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Beskrivelse
                </label>
                <textarea
                  value={selectedRole.description}
                  onChange={(e) => setSelectedRole({ ...selectedRole, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg"
                  disabled={selectedRole.id === 'admin'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Farge
                </label>
                <div className="flex gap-2">
                  {['red', 'purple', 'blue', 'green', 'yellow', 'orange', 'pink', 'indigo'].map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedRole({ ...selectedRole, color })}
                      disabled={selectedRole.id === 'admin'}
                      className={`w-10 h-10 rounded-lg border-2 transition-all ${
                        selectedRole.color === color ? 'border-slate-900 dark:border-white scale-110' : 'border-transparent'
                      } ${
                        color === 'red' ? 'bg-red-500' :
                        color === 'purple' ? 'bg-purple-500' :
                        color === 'blue' ? 'bg-blue-500' :
                        color === 'green' ? 'bg-green-500' :
                        color === 'yellow' ? 'bg-yellow-500' :
                        color === 'orange' ? 'bg-orange-500' :
                        color === 'pink' ? 'bg-pink-500' :
                        'bg-indigo-500'
                      } ${selectedRole.id === 'admin' ? 'opacity-50 cursor-not-allowed' : ''}`}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                  Tilganger
                </label>
                <div className="space-y-2 max-h-64 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                  {availablePermissions.map((permission) => (
                    <label
                      key={permission}
                      className={`flex items-start gap-3 p-2 rounded ${
                        selectedRole.id === 'admin'
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedRole.permissions.includes(permission)}
                        onChange={() => togglePermission(permission, true)}
                        disabled={selectedRole.id === 'admin'}
                        className="mt-0.5 w-4 h-4 rounded"
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-300">{permission}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowEditRoleModal(false);
                  setSelectedRole(null);
                }}
                className="px-4 py-2 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Avbryt
              </button>
              <button
                onClick={handleEditRole}
                disabled={selectedRole.id === 'admin'}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Lagre endringer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


function ChangePasswordForm() {
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const handleChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) { setMsg('Passordet må være minst 6 tegn'); return; }
    if (newPassword !== confirm) { setMsg('Passordene stemmer ikke overens'); return; }
    setSaving(true); setMsg('');
    const { supabase: client } = await import('../../lib/supabase');
    const { error } = await client.auth.updateUser({ password: newPassword });
    if (error) setMsg('Feil: ' + error.message);
    else { setMsg('Passord oppdatert ✓'); setNewPassword(''); setConfirm(''); }
    setSaving(false);
  };

  return (
    <form onSubmit={handleChange} className="space-y-4">
      {msg && (
        <div className={`text-sm rounded-lg px-4 py-3 ${
          msg.includes('Feil') || msg.includes('stemmer') || msg.includes('minst')
            ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
            : 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
        }`}>{msg}</div>
      )}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Nytt passord</label>
        <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
          placeholder="Min. 6 tegn" className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Bekreft passord</label>
        <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
          placeholder="Gjenta nytt passord" className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <button type="submit" disabled={saving}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50">
        {saving ? 'Lagrer...' : 'Oppdater passord'}
      </button>
    </form>
  );
}