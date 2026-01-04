import teamPhoto from '../assets/images/team.jpg'

const Team = () => {
  return (
    <main className="bg-slate-950 pt-28 text-white">
      <section className="mx-auto w-full max-w-6xl px-6 pb-20">
        <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr]">
          <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr] md:items-start">
            <div className="order-2 md:order-none">
              <p className="text-xs uppercase tracking-[0.4em] text-cyan-200/70">
                Team
              </p>
              <h1 className="mt-6 text-4xl font-semibold">
                Student-Led Polar Navigation Research
              </h1>
              <p className="mt-6 text-white/70">
                PolarNav is a student research project led by three students
                from Korean Minjok Leadership Academy. We work as an
                interdisciplinary dream team across data, simulation, and
                operations to build rigorous, credible navigation concepts for
                polar routes.
              </p>
            </div>
            <div className="order-1 md:order-none">
              <img
                src={teamPhoto}
                alt="PolarNav student team from Korean Minjok Leadership Academy"
                className="mx-auto w-full max-w-sm rounded-xl shadow-md ring-1 ring-white/10 md:max-w-none"
              />
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">
              Research Focus
            </p>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <li>Interdisciplinary collaboration and prototyping</li>
              <li>Safety-minded navigation and validation</li>
              <li>Data-driven polar route analysis</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              name: 'Gayoung Kim',
              role: 'Data Collection & Integration',
            },
            {
              name: 'Minjoo Lee',
              role: 'Simulation & Software',
            },
            {
              name: 'Allison Younghyun Chun',
              role: 'Business & Operations',
            },
          ].map((member) => (
            <div
              key={member.name}
              className="rounded-3xl border border-white/10 bg-slate-900/60 p-6"
            >
              <p className="text-lg font-semibold">{member.name}</p>
              <p className="mt-2 text-sm text-white/70">{member.role}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

export default Team
