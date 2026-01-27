import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';
import { EditUser } from './EditUser';
import { CreateUser } from './CreateUser';
import { supabase } from '../lib/supabase';

interface UserProfile {
  id: string;
  full_name: string;
  username: string;
  phone: string;
  gender: string;
  coupon: string;
  status: string;
  trial_days?: string;
  created_at: string;
  role: string;
}

interface UserManagementProps {
  onBack: () => void;
}

export const UserManagement: React.FC<UserManagementProps> = ({ onBack }) => {
  const [view, setView] = useState<'list' | 'edit' | 'create'>('list');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user: UserProfile) => {
    setSelectedUser(user);
    setView('edit');
  };

  useEffect(() => {
    filterUsers();
  }, [searchTerm, statusFilter, users]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'user')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) {
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let result = users;

    if (searchTerm) {
      result = result.filter(u =>
        u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.phone?.includes(searchTerm) ||
        u.username?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      if (statusFilter === 'active') {
        result = result.filter(u => u.status === 'Ativo');
      } else if (statusFilter === 'trial') {
        result = result.filter(u => u.status?.includes('Teste'));
      }
    }

    setFilteredUsers(result);
  };

  if (view === 'edit' && selectedUser) {
    return <EditUser user={selectedUser} onBack={() => { setView('list'); fetchUsers(); }} />;
  }

  if (view === 'create') {
    return <CreateUser onBack={() => { setView('list'); fetchUsers(); }} />;
  }

  return (
    <div className="bg-background-dark text-[#f0f0f0] min-h-screen flex flex-col font-display">
      <header className="sticky top-0 z-50 bg-[#141414]/90 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center p-4 justify-between w-full max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center justify-center size-10 rounded-lg hover:bg-white/10 transition-colors"
            >
              <Icon name="arrow_back" className="text-white" />
            </button>
            <h1 className="text-xl font-bold tracking-tight text-[#f0f0f0] uppercase italic">Gestão de Alunos</h1>
          </div>
          <div className="flex gap-2">
            <button className="flex size-10 items-center justify-center rounded-lg hover:bg-white/10 text-white transition-colors relative">
              <Icon name="notifications" />
              <span className="absolute top-2.5 right-2.5 size-2 bg-primary rounded-full border-2 border-background-dark"></span>
            </button>
            <div className="size-10 rounded-lg overflow-hidden border border-white/10">
              <img alt="Admin" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhGng9xzRyM8Qy6Mpdqo0RlfYeiGW2GwP3990lmt4X6-0hnSUT38SP9vC2GXyExjmdx1-2wzMeR0JlFXOCWQR6o7COgrzwHNj1J9vl-EDz8C0ae1WfGtHmRx8ZlGL2j3UvSgs5SQr81YI549gKY7-9cl_2QP6cinm4s4DxIG3DSDZsiCGx751iJ6aLDl3ChmV2fa8192PyOoZv7gZlH-iqxz1DB_gUxHirDIxNYgNymHNIG0-6EeCikSfjOtjWXAKNWAhbU9XYjzJt" />
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
              <Icon name="search" />
            </span>
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-card-dark border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-[#f0f0f0] focus:ring-primary focus:border-primary placeholder:text-slate-500 focus:outline-none"
              placeholder="Buscar aluno por nome ou telefone..."
              type="text"
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-card-dark border-white/10 rounded-lg pl-4 pr-10 py-2.5 text-sm text-[#f0f0f0] appearance-none focus:ring-primary focus:border-primary outline-none"
              >
                <option value="all">Todos os Status</option>
                <option value="active">Plano Ativo</option>
                <option value="trial">Teste Grátis</option>
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                <Icon name="expand_more" />
              </span>
            </div>
            <button
              onClick={() => setView('create')}
              className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center gap-2 shrink-0"
            >
              <Icon name="person_add" className="text-sm" />
              NOVO ALUNO
            </button>
          </div>
        </div>
        <div className="bg-card-dark rounded-xl border border-white/5 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="border-b border-white/5 bg-black/20">
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Aluno</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Telefone</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Treino</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Cupom</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Status</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Data de Ingresso</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="animate-spin size-8 border-4 border-primary border-t-transparent rounded-full"></div>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Carregando alunos...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500 uppercase font-black text-sm italic tracking-widest">
                      Nenhum aluno encontrado
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <UserRow
                      key={user.id}
                      name={user.full_name || 'Sem nome'}
                      phone={user.phone || '—'}
                      gender={user.gender || '—'}
                      coupon={user.coupon || '—'}
                      status={user.status || 'Ativo'}
                      trialDays={user.trial_days}
                      date={new Date(user.created_at).toLocaleDateString('pt-BR')}
                      avatar={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name || 'U')}&background=DC003C&color=fff`}
                      onEdit={() => handleEdit(user)}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 bg-black/20 border-t border-white/5 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Mostrando {filteredUsers.length} de {users.length} alunos</span>
            <div className="flex gap-1">
              <button className="size-8 flex items-center justify-center rounded border border-white/10 hover:bg-white/5 transition-colors">
                <Icon name="chevron_left" className="text-sm" />
              </button>
              <button className="size-8 flex items-center justify-center rounded bg-primary text-white font-bold text-xs">1</button>
              <button className="size-8 flex items-center justify-center rounded border border-white/10 hover:bg-white/5 transition-colors font-bold text-xs">2</button>
              <button className="size-8 flex items-center justify-center rounded border border-white/10 hover:bg-white/5 transition-colors font-bold text-xs">3</button>
              <button className="size-8 flex items-center justify-center rounded border border-white/10 hover:bg-white/5 transition-colors">
                <Icon name="chevron_right" className="text-sm" />
              </button>
            </div>
          </div>
        </div>
      </main>
      <div className="h-8 w-full bg-transparent"></div>
    </div>
  );
};

interface UserRowProps {
  name: string;
  phone: string;
  gender: string;
  coupon: string;
  status: string;
  trialDays?: string;
  date: string;
  avatar: string;
  onEdit: () => void;
}

const UserRow: React.FC<UserRowProps> = ({ name, phone, gender, coupon, status, trialDays, date, avatar, onEdit }) => {
  const isTrial = status.includes("Teste");
  const statusClasses = isTrial
    ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
    : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";

  return (
    <tr className="hover:bg-white/[0.02] transition-colors group border-b border-white/5 last:border-0">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <img alt="Avatar" className="size-10 rounded-full bg-slate-800 object-cover" src={avatar} />
          <span className="font-semibold text-[#f0f0f0]">{name}</span>
        </div>
      </td>
      <td className="px-6 py-4 text-slate-400 text-sm">{phone}</td>
      <td className="px-6 py-4 text-[#f0f0f0] text-xs font-bold uppercase tracking-wide">{gender}</td>
      <td className="px-6 py-4 text-slate-400 text-sm font-mono uppercase tracking-wider">{coupon}</td>
      <td className="px-6 py-4">
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border whitespace-nowrap ${statusClasses}`}>
          {status}{trialDays ? ` - ${trialDays}` : ''}
        </span>
      </td>
      <td className="px-6 py-4 text-slate-400 text-sm">{date}</td>
      <td className="px-6 py-4 text-right">
        <button onClick={onEdit} className="text-primary hover:text-white bg-primary/10 hover:bg-primary px-4 py-1.5 rounded text-xs font-bold transition-all uppercase">Editar</button>
      </td>
    </tr>
  );
};
