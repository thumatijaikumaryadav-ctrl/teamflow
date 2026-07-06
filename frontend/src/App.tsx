import { useEffect, useState, type FormEvent } from 'react'
import { BarChart3, BellRing, CheckCircle2, Clock3, FolderKanban, Layers3, PlusCircle, Search, ShieldCheck, Sparkles, Users, X } from 'lucide-react'
import './App.css'

type Stat = {
  label: string
  value: string
  trend: string
}

type Project = {
  id: number
  name: string
  progress: number
  owner: string
  due: string
}

type Activity = {
  id: number
  user: string
  action: string
  time: string
}

type NotificationItem = {
  id: number
  text: string
  unread: boolean
}

function App() {
  const [stats, setStats] = useState<Stat[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [activity, setActivity] = useState<Activity[]>([])
  const [activeView, setActiveView] = useState('Dashboard')
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [newProjectOpen, setNewProjectOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [draftProject, setDraftProject] = useState({ name: '', owner: '', due: '' })
  const [statusMessage, setStatusMessage] = useState('Everything is flowing smoothly.')
  const [notifications] = useState<NotificationItem[]>([
    { id: 1, text: '3 reviewers approved the RCA update', unread: true },
    { id: 2, text: 'Mina assigned 2 subtasks in Platform Refresh', unread: false },
  ])

  useEffect(() => {
    fetch('http://localhost:4000/api/dashboard')
      .then((res) => res.json())
      .then((data) => {
        setStats(data.stats)
        setProjects(data.projects)
        setActivity(data.activity)
      })
      .catch(() => {
        setStats([
          { label: 'Active Projects', value: '24', trend: '+12%' },
          { label: 'Open Tasks', value: '184', trend: '+5%' },
          { label: 'Velocity', value: '94%', trend: '+9%' },
          { label: 'Risk Alerts', value: '7', trend: '-2' },
        ])
        setProjects([
          { id: 1, name: 'Platform Refresh', progress: 78, owner: 'Nia', due: 'Aug 16' },
          { id: 2, name: 'Mobile SDK', progress: 64, owner: 'Mateo', due: 'Sep 02' },
          { id: 3, name: 'RCA Workflow', progress: 91, owner: 'Iris', due: 'Jul 22' },
        ])
        setActivity([
          { id: 1, user: 'Mina', action: 'completed review for onboarding flow', time: '5m ago' },
          { id: 2, user: 'Drew', action: 'assigned 3 subtasks in Platform Refresh', time: '18m ago' },
          { id: 3, user: 'Sage', action: 'created RCA report for API latency', time: '44m ago' },
        ])
      })
  }, [])

  const filteredProjects = projects.filter((project) => {
    const term = searchTerm.toLowerCase()
    return !term || project.name.toLowerCase().includes(term) || project.owner.toLowerCase().includes(term)
  })

  const filteredActivity = activity.filter((item) => {
    const term = searchTerm.toLowerCase()
    return !term || item.user.toLowerCase().includes(term) || item.action.toLowerCase().includes(term)
  })

  const handleSection = (section: string) => {
    setActiveView(section)
    setStatusMessage(`Opened ${section} workspace.`)
    setSearchOpen(false)
    setNotificationsOpen(false)
  }

  const handleCreateProject = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!draftProject.name.trim()) {
      setStatusMessage('Project name is required.')
      return
    }

    const project: Project = {
      id: Date.now(),
      name: draftProject.name.trim(),
      progress: 12,
      owner: draftProject.owner.trim() || 'You',
      due: draftProject.due.trim() || 'TBD',
    }

    setProjects([project, ...projects])
    setDraftProject({ name: '', owner: '', due: '' })
    setNewProjectOpen(false)
    setActiveView('Projects')
    setStatusMessage(`Created ${project.name}.`)
  }

  const handleSearch = () => {
    setSearchOpen((open) => {
      const next = !open
      setStatusMessage(next ? 'Search is active.' : 'Closed search.')
      return next
    })
  }

  const handleBell = () => {
    setNotificationsOpen((open) => {
      const next = !open
      setStatusMessage(next ? 'Showing recent alerts.' : 'Notifications closed.')
      return next
    })
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.28),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(217,70,239,0.22),_transparent_28%),linear-gradient(135deg,#060b16,#111c33)] text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col lg:flex-row">
        <aside className="w-full border-b border-white/10 bg-slate-950/45 p-6 backdrop-blur-xl lg:w-72 lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-gradient-to-br from-fuchsia-500 via-violet-500 to-cyan-400 p-3 shadow-lg shadow-cyan-500/20">
              <FolderKanban className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xl font-semibold tracking-tight">TeamFlow</p>
              <p className="text-sm text-slate-400">Engineering command center</p>
            </div>
          </div>

          <nav className="mt-8 space-y-2 text-sm">
            {['Dashboard', 'Projects', 'Tasks', 'RCA', 'Admin'].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleSection(item)}
                className={`flex w-full items-center justify-between rounded-2xl px-3 py-2 text-left transition ${activeView === item ? 'bg-cyan-500/20 text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}
              >
                <span>{item}</span>
                <span className="text-slate-500">↗</span>
              </button>
            ))}
          </nav>

          <div className="mt-8 rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/10 to-fuchsia-500/10 p-4 shadow-inner shadow-cyan-500/10">
            <p className="text-sm font-medium text-cyan-200">Secure by default</p>
            <p className="mt-2 text-sm text-slate-400">JWT auth, role-based access, audit trails, and notifications are built in.</p>
          </div>
        </aside>

        <main className="flex-1 p-6 lg:p-8">
          <header className="flex flex-col gap-4 rounded-[30px] border border-white/10 bg-white/10 p-6 shadow-[0_25px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Engineering command center</p>
              <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">Ship faster with clarity.</h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleSearch}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/30 px-3 py-2 text-sm text-slate-300"
              >
                <Search className="h-4 w-4" />
                Global search
              </button>
              <button type="button" onClick={handleBell} className="rounded-full bg-white/10 p-2">
                <BellRing className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setNewProjectOpen(true)
                  setStatusMessage('Creating a new project.')
                }}
                className="rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 px-4 py-2 text-sm font-semibold text-white"
              >
                New Project
              </button>
            </div>
          </header>

          <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/45 p-4 text-sm text-slate-400 shadow-lg shadow-black/10 backdrop-blur">
            <p className="text-cyan-300">{activeView} workspace</p>
            <p className="mt-1">{statusMessage}</p>
          </div>

          {searchOpen ? (
            <div className="mt-4 rounded-[24px] border border-cyan-400/20 bg-slate-950/70 p-4 backdrop-blur">
              <label className="mb-2 block text-sm text-slate-300" htmlFor="search">
                Search projects and activity
              </label>
              <input
                id="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/10 px-3 py-2 text-sm outline-none"
                placeholder="Try Platform, Nia, or RCA"
              />
            </div>
          ) : null}

          {notificationsOpen ? (
            <div className="mt-4 rounded-[24px] border border-white/10 bg-slate-950/70 p-4 backdrop-blur">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold">Notifications</h2>
                <button type="button" onClick={() => setNotificationsOpen(false)} className="text-slate-400">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-2">
                {notifications.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-white/10 bg-white/5 p-3 text-sm">
                    <p>{item.text}</p>
                    {item.unread ? <span className="mt-1 text-xs text-cyan-300">Unread</span> : null}
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <article key={stat.label} className="rounded-[24px] border border-white/10 bg-gradient-to-br from-slate-900/75 to-slate-950/70 p-4 shadow-[0_16px_40px_rgba(0,0,0,0.18)] backdrop-blur">
                <p className="text-sm text-slate-400">{stat.label}</p>
                <p className="mt-2 text-3xl font-semibold tracking-tight">{stat.value}</p>
                <div className="mt-3 inline-flex rounded-full bg-emerald-500/15 px-2.5 py-1 text-sm text-emerald-300">{stat.trend}</div>
              </article>
            ))}
          </section>

          <section className="mt-6 grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
            <div className="rounded-[28px] border border-white/10 bg-slate-950/45 p-5 shadow-[0_16px_45px_rgba(0,0,0,0.2)] backdrop-blur">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Live projects</h2>
                <button type="button" onClick={() => handleSection('Projects')} className="text-sm text-cyan-300">
                  View all
                </button>
              </div>
              <div className="space-y-4">
                {(searchTerm ? filteredProjects : projects).map((project) => (
                  <div key={project.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-medium">{project.name}</p>
                        <p className="text-sm text-slate-400">Owner {project.owner} • Due {project.due}</p>
                      </div>
                      <div className="text-right text-sm text-slate-300">
                        <div className="mb-1 h-2 w-24 rounded-full bg-white/10">
                          <div className="h-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-400" style={{ width: `${project.progress}%` }} />
                        </div>
                        {project.progress}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-slate-950/45 p-5 shadow-[0_16px_45px_rgba(0,0,0,0.2)] backdrop-blur">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Recent activity</h2>
                <button type="button" onClick={() => handleSection('Admin')} className="text-sm text-cyan-300">
                  See all
                </button>
              </div>
              <div className="space-y-3">
                {(searchTerm ? filteredActivity : activity).map((item) => (
                  <div key={item.id} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <p className="font-medium">{item.user}</p>
                    <p className="text-sm text-slate-400">{item.action}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.25em] text-slate-500">{item.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-6 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[28px] border border-white/10 bg-slate-950/45 p-5 shadow-[0_16px_45px_rgba(0,0,0,0.2)] backdrop-blur">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Delivery roadmap</h2>
                <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs text-emerald-300">On track</span>
              </div>
              <div className="space-y-3">
                {[
                  { title: 'Sprint review', meta: 'Today • 2:30 PM', state: 'Ready' },
                  { title: 'QA handoff', meta: 'Tomorrow • 11:00 AM', state: 'Pending' },
                  { title: 'RCA sign-off', meta: 'Friday • 4:00 PM', state: 'In review' },
                ].map((item) => (
                  <div key={item.title} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-3">
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-slate-400">{item.meta}</p>
                    </div>
                    <span className="text-sm text-cyan-300">{item.state}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-slate-950/45 p-5 shadow-[0_16px_45px_rgba(0,0,0,0.2)] backdrop-blur">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Team pulse</h2>
                <Users className="h-4 w-4 text-cyan-300" />
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Healthy velocity', value: '94%', icon: <CheckCircle2 className="h-4 w-4 text-emerald-300" /> },
                  { label: 'Pending reviews', value: '12', icon: <Clock3 className="h-4 w-4 text-amber-300" /> },
                  { label: 'Cross-team blockers', value: '3', icon: <Layers3 className="h-4 w-4 text-cyan-300" /> },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-3">
                    <div className="flex items-center gap-2">
                      {item.icon}
                      <span className="text-sm text-slate-300">{item.label}</span>
                    </div>
                    <span className="font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-6 grid gap-4 lg:grid-cols-3">
            {[
              { title: 'Kanban, list & calendar', text: 'Switch between views instantly and move work with drag-and-drop flows.' },
              { title: 'RCA workflows', text: 'Track incidents, approvals, corrective actions, and reviewer feedback in one place.' },
              { title: 'Enterprise security', text: 'Role-based access, audit logs, and notification controls keep every team aligned.' },
            ].map((feature) => (
              <button
                key={feature.title}
                type="button"
                onClick={() => handleSection(feature.title.includes('RCA') ? 'RCA' : feature.title.includes('Enterprise') ? 'Admin' : 'Tasks')}
                className="rounded-[28px] border border-white/10 bg-white/10 p-5 text-left shadow-[0_16px_40px_rgba(0,0,0,0.16)] backdrop-blur transition hover:-translate-y-0.5 hover:border-cyan-400/40"
              >
                <div className="mb-4 inline-flex rounded-2xl bg-gradient-to-br from-fuchsia-500/20 to-cyan-400/20 p-2">
                  {feature.title.includes('RCA') ? <ShieldCheck className="h-5 w-5" /> : feature.title.includes('Enterprise') ? <Sparkles className="h-5 w-5" /> : <BarChart3 className="h-5 w-5" />}
                </div>
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{feature.text}</p>
              </button>
            ))}
          </section>

          {newProjectOpen ? (
            <div className="fixed inset-0 z-20 flex items-center justify-center bg-slate-950/70 p-4">
              <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-slate-900 p-6 shadow-2xl">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Create project</h2>
                  <button type="button" onClick={() => setNewProjectOpen(false)} className="text-slate-400">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <form onSubmit={handleCreateProject} className="space-y-3">
                  <input
                    value={draftProject.name}
                    onChange={(event) => setDraftProject((current) => ({ ...current, name: event.target.value }))}
                    className="w-full rounded-2xl border border-white/10 bg-white/10 px-3 py-2 outline-none"
                    placeholder="Project name"
                  />
                  <input
                    value={draftProject.owner}
                    onChange={(event) => setDraftProject((current) => ({ ...current, owner: event.target.value }))}
                    className="w-full rounded-2xl border border-white/10 bg-white/10 px-3 py-2 outline-none"
                    placeholder="Owner"
                  />
                  <input
                    value={draftProject.due}
                    onChange={(event) => setDraftProject((current) => ({ ...current, due: event.target.value }))}
                    className="w-full rounded-2xl border border-white/10 bg-white/10 px-3 py-2 outline-none"
                    placeholder="Due date"
                  />
                  <button type="submit" className="flex items-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 px-4 py-2 text-sm font-semibold text-white">
                    <PlusCircle className="h-4 w-4" />
                    Create project
                  </button>
                </form>
              </div>
            </div>
          ) : null}
        </main>
      </div>
    </div>
  )
}

export default App
