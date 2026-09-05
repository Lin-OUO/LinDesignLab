import { createRoot } from 'react-dom/client'
import { useEffect, useRef, useState } from 'react'
import './style.css'
import './overrides.css'

const Arrow = () => <span className="arrow" aria-hidden="true">↗</span>
const heroImages = Array.from({ length: 8 }, (_, index) => `/TITLE/video/${String(index + 1).padStart(2, '0')}.jpg`)
const LinkifiedText = ({ text }) => text.split(/(https?:\/\/[^\s]+|@owen)/gi).map((part, index) => {
  if (/^https?:\/\//.test(part)) return <a key={`${part}-${index}`} href={part} target="_blank" rel="noreferrer">{part}</a>
  if (/^@owen$/i.test(part)) return <a key={`${part}-${index}`} href="https://www.instagram.com/owenxx_1023/" target="_blank" rel="noreferrer">{part}</a>
  return part
})

function ProjectCover({ project, onOpen, eager = false }) {
  const cover = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      entry.target.classList.add('is-visible')
      observer.unobserve(entry.target)
    }, { threshold: .12 })
    if (cover.current) observer.observe(cover.current)
    return () => observer.disconnect()
  }, [])

  if (!project.title) return <article ref={cover} className="project-full-cover project-enter">{project.cover && <img src={project.cover} alt={`${project.id} project cover`} loading={eager ? 'eager' : 'lazy'} fetchPriority={eager ? 'high' : 'auto'} decoding="async" />}</article>

  return <button ref={cover} className="project-full-cover is-clickable project-enter" type="button" onClick={() => onOpen(project)}>{project.cover && <img src={project.cover} alt={`${project.id} project cover`} loading={eager ? 'eager' : 'lazy'} fetchPriority={eager ? 'high' : 'auto'} decoding="async" />}<span>{project.title}</span></button>
}
const OrbitalMark = ({ className = '' }) => (
  <svg className={`orbital-mark ${className}`} viewBox="0 0 180 90" fill="none" aria-hidden="true">
    <ellipse cx="96" cy="45" rx="47" ry="38" stroke="currentColor" />
    <path d="M10 45h160M96 7v76M34 72l116-54" stroke="currentColor" strokeDasharray="3 4" />
    <circle cx="96" cy="45" r="4" fill="currentColor" />
  </svg>
)

const defaultContent = {
  TITLE: { eyebrow: '01 / TITLE\nAUTOMOTIVE · PRODUCT · VISUAL DESIGNER', name: 'LIHAOLIN', footer: 'DESIGNING MOTION, OBJECTS & EMOTION' },
  ABOUT: { label: 'ABOUT', location: 'BASED IN SHANGHAI, CN', lead: '用温柔的秩序\n安放对美好生活的想象', body: '李昊霖是一位跨越视觉、产品与汽车设计领域的设计师，现专注于汽车前瞻设计，擅长将概念研究、用户体验与设计表达整合为兼具系统性的设计理念与感受张力的设计语言。', profileNameChinese: '李昊霖', profileName: 'LI HAOLIN', profileIntro: '李昊霖是一位以汽车前瞻设计为核心实践方向的跨领域设计师，毕业于江南大学产品设计专业，现任职于泛亚汽车技术有限公司设计部前瞻策略团队。其设计训练覆盖产品设计、视觉表达与数字三维建模，并在汽车概念开发、量产项目推进与品牌体验设计之间形成了较为完整的方法体系。\n\n在工作方法上，他关注从前期概念研究、主题创意与设计草图，到数字模型、渲染可视化及样件落地的连续转译过程；能够在用户感知、品牌识别、工程条件与制造可行性之间建立平衡。其参与的项目涵盖概念车外饰与灯光、交互屏幕与展陈呈现、量产 SUV 及 Hatchback 外饰方案、车展技术展示和品牌终端焕新等多个尺度，具备将抽象策略落实为具体设计方案的能力。\n\n李昊霖的设计倾向于以理性的系统思维组织感性表达：既重视汽车造型、光效与材质所构成的情绪体验，也重视跨部门协作、评审逻辑、供应链沟通与项目节奏对最终成果的塑造。他希望通过清晰、克制且具有叙事性的设计语言，使产品在技术演进与日常使用之间建立更具辨识度的体验价值。', profileTimeline: [{ period: '2019 — 2023', title: 'JIANGNAN UNIVERSITY · PRODUCT DESIGN', detail: 'Studied Product Design at Jiangnan University.' }, { period: '2023 — NOW', title: 'PATAC DESIGN DEPARTMENT', detail: 'Forward Innovation Product Designer at Pan Asia Technical Automotive Center.' }] },
  PROJECTS: { label: '03 / PROJECTS', date: '2023 — NOW', heading: 'DESIGN FOR\nTHE NEXT MOVE.' },
  CONTACT: { label: '04 / CONTACT', note: 'OPEN FOR SELECTED COLLABORATIONS', heading: "LET'S CREATE\nSOMETHING WITH MEANING." },
}

function AboutProfileOverlay({ content, onClose }) {
  useEffect(() => {
    const onKeyDown = (event) => event.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div className="profile-overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="profile-window" role="dialog" aria-modal="true" aria-labelledby="profile-name">
        <div className="profile-topline"><button type="button" onClick={onClose}>CLOSE <span>×</span></button></div>
        <div className="profile-layout">
          <div className="profile-visual"><img src="/ABOUT/rd.jpg" alt="李昊霖肖像" /></div>
          <div className="profile-panel">
          <div className="profile-content">
            <p className="profile-name-cn">{content.profileNameChinese}</p>
            <h2 id="profile-name">{content.profileName}</h2>
            <div className="profile-timeline">
              {content.profileTimeline.map((item) => <article key={item.period}><span>{item.period}</span><div><h3>{item.title}</h3><p>{item.detail}</p></div></article>)}
            </div>
            <p className="profile-summary">{content.body}</p>
            <div className="profile-bottom"><div className="profile-contact-details"><a href="tel:18273601152">+86&nbsp;&nbsp;18273601152</a><a href="mailto:18273601152@163.com">18273601152@163.com</a></div><div className="profile-qr-area"><span>CLICK</span><div className="profile-qr-links"><img src="/ABOUT/contact%20way.png" alt="李昊霖联系方式二维码" /><a href="https://www.instagram.com/lhl.ouo/" target="_blank" rel="noreferrer" aria-label="打开 Instagram"></a><a href="https://www.xiaohongshu.com/user/profile/5dd8b0fb0000000001003e57?xsec_token=ABysSM4JzRWi9RGVNhpBKuI8FM5B4xlTdAbjZ4zT6ToWs%3D&xsec_source=pc_search" target="_blank" rel="noreferrer" aria-label="打开小红书"></a><a href="https://space.bilibili.com/436201717?spm_id_from=333.1007.0.0" target="_blank" rel="noreferrer" aria-label="打开哔哩哔哩"></a></div></div></div>
          </div>
        </div>
        </div>
      </section>
    </div>
  )
}

function ProjectDetailOverlay({ project, onClose }) {
  const [zoomedImage, setZoomedImage] = useState(null)
  const [imageZoom, setImageZoom] = useState(1)
  useEffect(() => {
    const onKeyDown = (event) => event.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  const openImage = (image) => {
    setImageZoom(1)
    setZoomedImage(image)
  }
  const zoomImage = (event) => {
    event.preventDefault()
    setImageZoom((current) => Math.min(4, Math.max(.6, current - event.deltaY * .0015)))
  }

  return (
    <div className="project-overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="project-window" role="dialog" aria-modal="true" aria-labelledby="project-detail-title">
        <header className="project-detail-topline"><button type="button" onClick={onClose}>CLOSE <span>×</span></button></header>
        <div className="project-detail-intro"><h2 id="project-detail-title">{project.innerTitle}</h2><p><LinkifiedText text={project.description} /></p></div>
        {project.videos?.length > 0 && <div className="project-video-flow">{project.videos.map((video) => <video key={video} src={video} autoPlay muted loop playsInline controls />)}</div>}
        <div className="project-image-flow">{project.images.map((image, index) => <img key={image} src={image} alt={`${project.title} — ${String(index + 1).padStart(2, '0')}`} loading="lazy" decoding="async" onClick={() => openImage(image)} />)}</div>
      </section>
      {zoomedImage && <div className="project-image-zoom" role="button" tabIndex={0} aria-label="关闭图片放大" onClick={() => setZoomedImage(null)} onWheel={zoomImage}><img src={zoomedImage} alt="项目图片放大预览" style={{ transform: `scale(${imageZoom})` }} /></div>}
    </div>
  )
}

function App() {
  const [content, setContent] = useState(defaultContent)
  const [profileOpen, setProfileOpen] = useState(() => window.location.pathname === '/about')
  const [projects, setProjects] = useState([])
  const [activeProject, setActiveProject] = useState(null)

  useEffect(() => {
    Promise.all(Object.keys(defaultContent).map(async (section) => {
      const response = await fetch(`/${section}/content.json`)
      if (!response.ok) return [section, {}]
      return [section, await response.json()]
    })).then((updates) => setContent((current) => Object.fromEntries(
      updates.map(([section, update]) => [section, { ...current[section], ...update }])
    ))).catch(() => {})
  }, [])

  useEffect(() => {
    const manifestUrl = import.meta.env.DEV ? '/api/projects' : '/PROJECTS/projects-manifest.json'
    fetch(manifestUrl).then((response) => response.ok ? response.json() : []).then(setProjects).catch(() => setProjects([]))
  }, [])

  useEffect(() => {
    const onPopState = () => setProfileOpen(window.location.pathname === '/about')
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    if (profileOpen || activeProject) document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previousOverflow }
  }, [profileOpen, activeProject])

  const openProfile = (event) => {
    event.preventDefault()
    if (!profileOpen) window.history.pushState({ overlay: 'about' }, '', '/about')
    setProfileOpen(true)
  }
  const closeProfile = () => {
    if (window.history.state?.overlay === 'about') window.history.back()
    else { window.history.replaceState({}, '', '/'); setProfileOpen(false) }
  }
  const goToContact = (event) => {
    event.preventDefault()
    window.history.replaceState({}, '', '/#contact')
    setProfileOpen(false)
    requestAnimationFrame(() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }))
  }

  return (
    <main>
      <section className="hero" id="top">
        <div className="hero-slideshow" aria-hidden="true">
          {heroImages.map((image, index) => <img key={image} className="hero-slide" src={image} alt="" style={{ animationDelay: `${index * -6}s` }} />)}
        </div>
        <div className="hero-wash" />
        <div className="hero-portrait" />
        <nav className="nav hero-shell">
          <a className="contact-pill" href="#top">BACK TO TOP <Arrow /></a>
          <div className="nav-links">
            <a href="#top">HOME</a><a href="#work">PROJECTS</a>
          </div>
        </nav>
        <div className="hero-identity"><p>李昊霖 <span>LI HAOLIN</span></p><small>ADV PRODUCT DESIGNER</small></div>
        <div className="hero-resume"><a href="/about" onClick={openProfile}>RESUME</a><a href="mailto:18273601152@163.com">18273601152@163.com</a></div>
        <div className="hero-footer hero-shell"><span>{content.TITLE.footer}</span><OrbitalMark /><span>SCROLL TO EXPLORE&nbsp;&nbsp;↓</span></div>
      </section>

      <section className="work" id="work">
        <div className="projects-intro page-width"><h2>Projects</h2><p>Production car design / Advanced Design / UX Design / ID design / Visual design</p></div>
        <div className="projects-feed">
          {projects.map((project, index) => <ProjectCover key={project.id} project={project} onOpen={setActiveProject} eager={index === 0} />)}
        </div>
      </section>

      {profileOpen && <AboutProfileOverlay content={content.ABOUT} onClose={closeProfile} onContact={goToContact} />}
      {activeProject && <ProjectDetailOverlay project={activeProject} onClose={() => setActiveProject(null)} />}
    </main>
  )
}

createRoot(document.getElementById('root')).render(<App />)
