"use client";

import { useEffect, useRef, useState } from "react";
import { Button, Chip, CroppedImage, Eyebrow, Icon, OriginalImage } from "./ui";
import {
  appScreens,
  collegeCards,
  employerCards,
  footerGroups,
  opportunities,
  roles,
  steps,
} from "../data/content";

function Header({ openDialog }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <header className="site-header" id="top">
      <div className="container header-inner">
        <a
          href="#top"
          className="header-logo"
          aria-label="CampusPe home"
          onClick={() => setExpanded(false)}
        >
          <CroppedImage
            hash="3d2477bcc3a4ad8e4862577ce5caea7c9cd0c79f"
            width={178}
            height={54}
            alt="CampusPe — Connecting Students, Institutions & Companies"
            transform={[
              [0.797619, 0, 0.10416667],
              [0, 0.3163168, 0.3476278],
            ]}
            priority
          />
        </a>
        <nav
          className={`main-nav ${expanded ? "is-open" : ""}`}
          id="main-navigation"
          aria-label="Main navigation"
        >
          <a href="#colleges" onClick={() => setExpanded(false)}>
            Colleges
          </a>
          <a href="#employers" onClick={() => setExpanded(false)}>
            Employers
          </a>
          <a href="#opportunities" onClick={() => setExpanded(false)}>
            Jobs
          </a>
          <button
            type="button"
            onClick={() => {
              setExpanded(false);
              openDialog("Blogs");
            }}
          >
            Blogs
          </button>
        </nav>
        <div className="header-actions">
          <Button variant="text" onClick={() => openDialog("Sign In")}>
            Sign In
          </Button>
          <Button className="signup" onClick={() => openDialog("Sign Up")}>
            Sign Up
          </Button>
        </div>
        <button
          className={`menu-toggle ${expanded ? "is-open" : ""}`}
          aria-label={expanded ? "Close navigation" : "Open navigation"}
          aria-controls="main-navigation"
          aria-expanded={expanded}
          onClick={() => setExpanded(!expanded)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}

function RoleCard({ role, openDialog }) {
  return (
    <article className={`role-card role-card--${role.type}`}>
      <div className="role-art" aria-hidden="true">
        <Icon id={role.art} />
      </div>
      <div className="role-card-top">
        <span className="role-icon">
          <Icon id={role.icon} />
        </span>
        <span className="role-status">{role.status}</span>
      </div>
      <div className="role-copy">
        <h2>{role.title}</h2>
        <p>{role.description}</p>
        <ul>
          {role.features.map((text) => (
            <li key={text}>
              <span className="check-circle">
                <Icon id="1-986" />
              </span>
              {text}
            </li>
          ))}
        </ul>
      </div>
      <Button
        href={role.href}
        onClick={role.action ? () => openDialog(role.action) : undefined}
        className="role-cta"
      >
        {role.cta}
        <Icon id={role.href ? "1-1060" : "1-1007"} />
      </Button>
    </article>
  );
}

function Hero({ openDialog }) {
  const heroRef = useRef(null);
  const moveGlow = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    heroRef.current?.style.setProperty(
      "--pointer-x",
      `${((event.clientX - rect.left) / rect.width) * 100}%`,
    );
    heroRef.current?.style.setProperty(
      "--pointer-y",
      `${((event.clientY - rect.top) / rect.height) * 100}%`,
    );
  };
  return (
    <section
      className="hero"
      aria-labelledby="hero-title"
      ref={heroRef}
      onPointerMove={moveGlow}
    >
      <div className="hero-glow" aria-hidden="true" />
      <div className="container hero-inner">
        <button
          className="floating-note whatsapp-note"
          onClick={() => openDialog("WhatsApp alerts")}
        >
          <span className="note-label">
            <Icon id="1-955" />
            WhatsApp Alert
          </span>
          <strong>Get notified on whatsapp</strong>
          <span>You’ll get all important updates on your whatsapp</span>
        </button>
        <button
          className="floating-note resume-note"
          onClick={() => document.getElementById("resume")?.scrollIntoView()}
        >
          <span className="note-label">
            <Icon id="1-877" />
            Resume Builder
          </span>
          <strong>Build Your Resume</strong>
          <span>
            Our resume builder gives you dynamic options to build better &amp;
            faster resume that got you hired
          </span>
        </button>
        <div className="hero-heading">
          <span className="ai-badge">
            <Icon id="1-884" />
            AI-Powered Campus Assistant
          </span>
          <h1 id="hero-title">
            Connect <span className="hero-multiplier">10X</span><span className="hero-faster">{" Faster."}</span>
          </h1>
          <p>
            One platform connecting students, colleges &amp; employers — faster.
          </p>
          <div className="hero-question">
            <span className="sparkles">
              <Icon id="1-899" />
              <Icon id="1-903" />
            </span>
            <h2>What are you looking for?</h2>
            <span className="sparkles sparkles--right">
              <Icon id="1-903" />
              <Icon id="1-913" />
            </span>
          </div>
        </div>
        <div className="activity activity--students">
          <span className="avatar-stack">
            <i>AK</i>
            <i>PR</i>
            <i>SN</i>
          </span>
          <div>
            <strong>
              <b className="online-dot" />
              🔥 142 students matched today
            </strong>
            <small>Just now • IIT, BITS, VIT</small>
          </div>
        </div>
        <div className="activity activity--recruiter">
          <span className="briefcase-emoji">💼</span>
          <div>
            <strong>
              <b>Radiant Info</b> shortlisted 8 interns
            </strong>
            <small>
              <b className="online-dot" />
              Verified recruiter • 2 days ago
            </small>
          </div>
        </div>
        <div className="role-grid">
          {roles.map((role) => (
            <RoleCard key={role.type} role={role} openDialog={openDialog} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Stats() {
  return (
    <section className="stats" aria-label="CampusPe in numbers">
      <div className="stats-inner">
        <div className="stat">
          <Icon id="1-823" />
          <div>
            <strong>800+</strong>
            <span>Students</span>
          </div>
        </div>
        <div className="stat">
          <span className="stat-college">
            <Icon id="1-835" />
            <Icon id="1-838" />
          </span>
          <div>
            <strong>130+</strong>
            <span>colleges</span>
          </div>
        </div>
        <div className="stat">
          <Icon id="1-854" />
          <div>
            <strong>100+</strong>
            <span>jobs &amp; internships</span>
          </div>
        </div>
        <div className="stat">
          <span className="stat-trust">
            <Icon id="1-812" />
            <Icon id="1-815" />
          </span>
          <div>
            <strong>100%</strong>
            <span>Safe &amp; Trusted</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function PartnerLogos({ duplicate = false }) {
  return (
        <div className="partner-track" aria-hidden={duplicate ? "true" : undefined}>
          <OriginalImage
            hash="2172309c15214160504e8198b07d1be50d00d07a"
            width={250}
            height={79}
            alt="GINSERV — Nurturing Ventures"
          />
          <OriginalImage
            hash="e6500a19dff57619d170ffb96d52a97536b61ee2"
            width={364}
            height={80}
            alt="Startup Karnataka"
          />
          <CroppedImage
            hash="ad47b637590505bbf20ff1429a263b1ebb4b7ea4"
            width={81}
            height={109}
            alt="Institutional partner"
            transform={[
              [0.3995786, 0, 0.2865265],
              [0, 0.9607844, 0],
            ]}
          />
          <CroppedImage
            hash="236fe24f4d06ce7212ccb78dd073110bb774d696"
            width={131}
            height={110}
            alt="TalentSpotify"
            transform={[
              [0.777096, 0, 0.1339468],
              [0, 0.593252, 0.0159325],
            ]}
          />
          <OriginalImage
            hash="39593d30307452110d6086ef6f594668f9246d54"
            width={115}
            height={115}
            alt="Radiant Info"
          />
          <CroppedImage
            hash="27d954c5a021cc9dd377f3e41542e0cc8ba8d508"
            width={290}
            height={104}
            alt="DPIIT Startup India"
            transform={[
              [0.6359274, 0, 0.1838176],
              [0, 0.9770992, 0.0229008],
            ]}
          />
        </div>
  );
}

function Partners() {
  return (
    <section className="partners" aria-label="Our partners">
      <h2>Trusted by partners across India</h2>
      <div className="partner-viewport">
        <div className="partner-marquee">
          <PartnerLogos />
          <PartnerLogos duplicate />
        </div>
      </div>
    </section>
  );
}

function CompanyMark({ type }) {
  return (
    <span className={`company-mark company-mark--${type}`} aria-hidden="true">
      {type === "google" ? (
        <Icon id="1-1242" />
      ) : type === "notion" ? (
        <Icon id="1-1272" />
      ) : (
        <span className="iim-mark">
          <Icon id="1-1211" />
          <Icon id="1-1212" />
          <Icon id="1-1213" />
          <span>M</span>
          <Icon id="1-1216" />
        </span>
      )}
    </span>
  );
}

function OpportunityFeed({ openDialog }) {
  const [filter, setFilter] = useState("All");
  const filters = [
    "All",
    "Colleges",
    "Jobs",
    "Internships",
    "Freelance",
    "Part-time",
  ];
  const shown = opportunities.filter(
    (item) =>
      filter === "All" ||
      item.type === filter ||
      (filter === "Jobs" && item.type !== "Colleges"),
  );
  return (
    <div className="feed-wrap">
      <div className="opportunity-feed" id="opportunity-feed">
        <div className="feed-header">
          <span className="feed-bolt">
            <Icon id="1-1182" />
          </span>
          <div>
            <h3>CampusPe Opportunity Feed</h3>
            <p>Colleges &amp; opportunities matched to you</p>
          </div>
          <span className="new-matches">● 12 new matches today</span>
        </div>
        <div
          className="feed-filters"
          role="group"
          aria-label="Filter opportunities"
        >
          {filters.map((item) => (
            <button
              key={item}
              className={filter === item ? "is-selected" : ""}
              aria-pressed={filter === item}
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="feed-items" key={filter} aria-live="polite">
          {shown.length ? (
            shown.map((item) => (
              <article className="feed-item" key={item.id}>
                <CompanyMark type={item.id} />
                <div className="feed-item-content">
                  <div className="feed-title">
                    <h4>{item.title}</h4>
                    <Chip tone={item.tone}>{item.badge}</Chip>
                  </div>
                  <div className="feed-meta">
                    <span>
                      <Icon
                        id={item.type === "Colleges" ? "1-1225" : "1-1229"}
                      />
                      {item.type === "Colleges" ? item.detail : item.location}
                    </span>
                    <span>
                      <Icon
                        id={item.type === "Colleges" ? "1-1229" : "1-1260"}
                      />
                      {item.type === "Colleges" ? item.location : item.detail}
                    </span>
                    <span>{item.price}</span>
                  </div>
                  <p>{item.text}</p>
                </div>
                <Button
                  className="feed-item-action"
                  onClick={() => openDialog(item.title)}
                >
                  {item.action}
                </Button>
              </article>
            ))
          ) : (
            <div className="empty-feed">
              <h4>No part-time matches in this preview</h4>
              <p>
                Explore the other categories to see the sample opportunities.
              </p>
              <button onClick={() => setFilter("All")}>
                Show all opportunities →
              </button>
            </div>
          )}
        </div>
        <div className="feed-footer">
          <button onClick={() => openDialog("Matched opportunities")}>
            View all matched opportunities <Icon id="1-1298" />
          </button>
          <span><span className="feed-curated">Curated for you</span> <span className="feed-separator">•</span> <span className="feed-updated">Updated daily</span></span>
        </div>
      </div>
      <div className="feed-annotation">
        <Icon id="1-1306" />
        <p>
          <span className="annotation-line">A mix of colleges, jobs,</span>
          <span className="annotation-line">internships and gigs — all in one place.</span>
        </p>
      </div>
    </div>
  );
}

function OpportunitySection({ openDialog }) {
  const [active, setActive] = useState(0);
  const sectionRef = useRef(null);
  const [entered, setEntered] = useState(false);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
      if (entry.isIntersecting) setEntered(true);
    }, { threshold: 0.15 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);
  return (
    <section
      className={`discovery section ${entered ? "has-entered" : ""} ${inView ? "motion-visible" : ""}`}
      ref={sectionRef}
      id="opportunities"
      aria-labelledby="discovery-title"
    >
      <div className="container discovery-grid">
        <div className="discovery-copy">
          <Eyebrow>01 • OPPORTUNITY DISCOVERY</Eyebrow>
          <h2 className="section-title" id="discovery-title">
            Stop searching.
            <br />
            <span>Start getting matched.</span>
          </h2>
          <p className="section-description">
            Tell CampusPe your skills, preferences and goals. We continuously
            monitor company career pages and job sources, find opportunities
            that match you,
            <br className="desktop-break" /> and notify you when they appear.
          </p>
          <div className="discovery-steps">
            {steps.map((step, i) => (
              <button
                key={step.title}
                className={`discovery-step ${active === i ? "is-active" : ""}`}
                aria-pressed={active === i}
                onClick={() => setActive(i)}
              >
                <span className="step-number">0{i + 1}</span>
                <span className="step-copy">
                  <span className="step-heading">
                    <strong>{step.title}</strong>
                    <Chip
                      tone={i === 2 ? "green" : i === 0 ? "indigo" : "slate"}
                    >
                      {step.badge}
                    </Chip>
                  </span>
                  <span className="step-description">{step.text}</span>
                </span>
              </button>
            ))}
          </div>
          <Button href="#opportunity-feed" arrow className="discovery-cta">
            Explore opportunities
          </Button>
        </div>
        <OpportunityFeed openDialog={openDialog} />
      </div>
    </section>
  );
}

function ResumeSection() {
  const inputRef = useRef(null);
  const stagesRef = useRef(null);
  const [stagesVisible, setStagesVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setStagesVisible(entry.isIntersecting), { threshold: 0.2 });
    if (stagesRef.current) observer.observe(stagesRef.current);
    return () => observer.disconnect();
  }, []);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const selectFile = (candidate) => {
    setError("");
    if (!candidate) return;
    if (!/\.(pdf|doc|docx)$/i.test(candidate.name)) {
      setError("Please choose a PDF, DOC, or DOCX file.");
      return;
    }
    if (candidate.size > 10 * 1024 * 1024) {
      setError("Please choose a file smaller than 10MB.");
      return;
    }
    setFile(candidate);
  };
  return (
    <section
      className="resume-section section"
      id="resume"
      aria-labelledby="resume-title"
    >
      <div className="resume-heading">
        <Eyebrow>
          TRY IT LIVE <span className="engine-label">v2.4 AI Engine</span>
        </Eyebrow>
        <h2 id="resume-title">
          Upload your resume.
          <br />
          <span>Find jobs that fit.</span>
        </h2>
        <p>
          Upload once. CampusPe reads your skills, experience, and preferences —
          <br className="desktop-break" /> then finds relevant jobs across
          1,000+ sources.
        </p>
      </div>
      <div className="upload-panel">
        <div
          className={`upload-shell ${dragging ? "is-dragging" : ""}`}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            selectFile(event.dataTransfer.files[0]);
          }}
        >
          <div className="drop-zone">
            <span className="corner corner--tl" />
            <span className="corner corner--tr" />
            <span className="corner corner--bl" />
            <span className="corner corner--br" />
            <h3>{file ? "Your resume is ready" : "Upload your resume"}</h3>
            <p>
              {file
                ? file.name
                : "PDF, DOC, or DOCX · Up to 10MB · We'll use it to understand your skills and experience."}
            </p>
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              className="visually-hidden"
              id="resume-file"
              onChange={(event) => selectFile(event.target.files[0])}
            />
            <Button
              className="upload-button"
              onClick={() => inputRef.current?.click()}
            >
              {file ? "Choose another file" : "Upload resume"}
              <span aria-hidden="true">↑</span>
            </Button>
            <small>
              {file
                ? "Selected locally for this static demo. Your file is not uploaded."
                : "or drag and drop your file here"}
            </small>
            <div className="file-types">
              <span>PDF</span>
              <span>DOC</span>
              <span>DOCX</span>
            </div>
          </div>
        </div>
        <div className="floating-tag match-tag">
          <span className="tag-icon">⚡</span>
          <span>
            <strong>98% Match Rate</strong>
            <small>AI semantic rank</small>
          </span>
        </div>
        <div className="floating-tag ats-tag">
          <span className="tag-icon">🔒</span>
          <span>
            <strong>ATS Compliant</strong>
            <small>Standardized parser</small>
          </span>
        </div>
      </div>
      <p className="upload-error" role="status">
        {error}
      </p>
      <div className={`matching-stages ${stagesVisible ? "is-running" : ""}`} ref={stagesRef}>
        {[
          ["Resume analyzed", "Ready in 4s", "1-1397"],
          ["Skills matched", "Deep taxonomy", "1-1409"],
          ["Experience matched", "Contextual seniority", "1-1420"],
          ["1,000+ sources searched", "Real-time aggregators", "1-1431"],
        ].map(([title, subtitle, icon]) => (
          <div key={title} className="matching-stage">
            <span className="matching-check">
              <Icon id={icon} />
            </span>
            <div>
              <strong>{title}</strong>
              <small>{subtitle}</small>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProcessCard({ item, index, employer = false }) {
  return (
    <article
      className={`process-card ${employer ? "process-card--employer" : ""}`}
    >
      <div className="process-copy">
        {!employer && (
          <div className="process-label">
            <span>0{index + 1}</span>
            {item.label}
          </div>
        )}
        {employer && <span className="process-number">0{index + 1}</span>}
        <div className="process-title">
          <h3>{item.title}</h3>
          {employer && (
            <Chip tone="indigo" className="instant-chip">
              INSTANT SETUP
            </Chip>
          )}
        </div>
        <p>{item.text}</p>
      </div>
      <div className="process-badges">
        {item.badges.map((badge) => (
          <Chip key={badge.text} tone={badge.tone} icon={badge.icon}>
            {badge.text}
          </Chip>
        ))}
      </div>
    </article>
  );
}

function AudienceSection({ employer = false, openDialog }) {
  const id = employer ? "employers" : "colleges";
  return (
    <section
      className={`audience-section section ${employer ? "employer-section" : "college-section"}`}
      id={id}
      aria-labelledby={`${id}-title`}
    >
      {!employer && <div className="college-overlays" aria-hidden="true"><span /><span /><span /></div>}
      <div className="container audience-grid">
        <div className="audience-copy">
          <Eyebrow>
            {employer ? "03 • FOR EMPLOYERS" : "02 • FOR COLLEGES"}
          </Eyebrow>
          <h2 className="section-title" id={`${id}-title`}>
            {employer ? (
              <>
                Stop running
                <br />
                campus drives.
                <br />
                <span>Start hiring the right people.</span>
              </>
            ) : (
              <>
                Get Discovered
                <br />
                by{" "}
                <span>
                  Students and
                  <br />
                  Recruiters.
                </span>
              </>
            )}
          </h2>
          <p className="section-description">
            {employer
              ? "Post a role in minutes and reach relevant candidates without the time, travel and coordination of traditional hiring. CampusPe helps you discover, match and connect with talent from colleges and beyond."
              : "Put your college in front of students searching for the right course and recruiters looking for the right talent. CampusPe helps you build your presence, attract enquiries and connect with opportunities."}
          </p>
          <Button
            arrow
            onClick={() =>
              openDialog(employer ? "Post a Job" : "List Your College")
            }
          >
            {employer ? "Post a Job" : "List Your College"}
          </Button>
        </div>
        <div className="process-cards">
          {(employer ? employerCards : collegeCards).map((item, index) => (
            <ProcessCard
              key={item.title}
              item={item}
              index={index}
              employer={employer}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function AppSection({ openDialog }) {
  const [selected, setSelected] = useState(2);
  const [phoneSlots, setPhoneSlots] = useState(() => appScreens.map((_, i) => i));
  const hoverLock = useRef(0);
  const selectScreen = (index) => {
    hoverLock.current = performance.now() + 850;
    if (index === selected) return;
    setPhoneSlots(slots => {
      const next = [...slots];
      const center = slots.indexOf(2);
      [next[index], next[center]] = [next[center], next[index]];
      return next;
    });
    setSelected(index);
  };
  return (
    <section
      className="app-section section"
      id="app"
      aria-labelledby="app-title"
    >
      <div className="app-heading">
        <h2 id="app-title">Checkout Our App Interface Look</h2>
        <p>
          Experience the power of a unified campus ecosystem right in your
          pocket. <strong>CampusPe</strong> offers a tailored interface for
          every user: students can explore trending courses, colleges can
          showcase their campus life, and companies can post job vacancies
          directly to a pool of qualified candidates.
        </p>
      </div>
      <div className="app-gallery" aria-label="CampusPe app screens">
        <Icon id="1-1669" className="app-gallery-glow" />
        <div className="phone-row">
          {appScreens.map((screen, index) => {
            const i = phoneSlots[index];
            return <div
              className={`phone phone--${i}`}
              key={screen.hash}
              onPointerMove={(event) => {
                if (event.pointerType !== "mouse" || (event.movementX === 0 && event.movementY === 0)) return;
                if (performance.now() >= hoverLock.current) selectScreen(index);
              }}
              onClick={() => selectScreen(index)}
            >
              <OriginalImage
                hash={screen.hash}
                alt={screen.alt}
                width={Math.round(screen.width)}
                height={Math.round(screen.height)}
              />
            </div>;
          })}
        </div>
        <Icon id="1-1683" className="gallery-edge gallery-edge--left" />
        <Icon id="1-1683" className="gallery-edge gallery-edge--right" />
        <div
          className="carousel-dots"
          role="group"
          aria-label="Choose an app screen"
        >
          {appScreens.map((screen, i) => (
            <button
              key={screen.hash}
              aria-label={`Show ${screen.alt}`}
              aria-pressed={selected === i}
              className={selected === i ? "is-selected" : ""}
              onClick={() => selectScreen(i)}
            />
          ))}
        </div>
        <p className="visually-hidden" aria-live="polite">
          {appScreens[selected].alt}
        </p>
      </div>
      <div className="container download-row">
        <div className="download-copy">
          <h2>Download App Now</h2>
          <p>
            Elevate your academic journey with Campuspe, the all-in-one digital
            ecosystem designed to bridge the gap between education and industry.
            Whether you’re a student seeking your next big internship, a college
            looking to empower your cohort, or a company scouting for top-tier
            talent, Campuspe streamlines the connection.Your career doesn&apos;t
            start at graduation—it starts here.
          </p>
          <div className="store-links">
            <button
              onClick={() => openDialog("Get the CampusPe app")}
              aria-label="Get CampusPe on Google Play"
            >
              <CroppedImage
                hash="a522304a8c74ef585b38a629cb918edf7f116e05"
                width={149}
                height={47}
                alt="Get it on Google Play"
                transform={[
                  [0.996758, 0, 0.001621],
                  [0, 0.4747475, 0],
                ]}
              />
            </button>
            <button
              onClick={() => openDialog("Get the CampusPe app")}
              aria-label="Download CampusPe on the App Store"
            >
              <CroppedImage
                hash="c52d780b7f4ede1720c93645d3ed6099bc5d537d"
                width={151}
                height={45}
                alt="Download on the App Store"
                transform={[
                  [0.4604775, 0, 0.5370315],
                  [0, 0.5301205, 0.4698795],
                ]}
              />
            </button>
          </div>
        </div>
        <div className="download-phones">
          <CroppedImage
            hash="3286356067aae1ad20863918ba884289e8381be1"
            width={780}
            height={536}
            alt="CampusPe discovery and application screens on two phones"
            transform={[
              [1.0004275, 0, 0],
              [0, 0.916631, 0.0837965],
            ]}
          />
        </div>
      </div>
    </section>
  );
}

function SupportSection() {
  return (
    <section
      className="support-section section"
      id="contact"
      aria-labelledby="support-title"
    >
      <div className="support-card">
        <div className="support-gradient support-gradient--left">
          <Icon id="1-1709" />
        </div>
        <div className="support-gradient support-gradient--right">
          <Icon id="1-1701" />
        </div>
        <div className="support-content">
          <h2 id="support-title">Still have questions?</h2>
          <p>
            Our support team is here to help you succeed. Get in touch anytime.
          </p>
          <div>
            <Button href="mailto:contactus@campuspe.com">
              Contact Support
              <span className="support-action-icon">
                <Icon id="I1-1722-3362-5743" />
              </span>
            </Button>
            <Button variant="outline" href="tel:+916362606464">
              Schedule a Call
              <span className="support-action-icon">
                <Icon id="I1-1723-3362-5759" />
              </span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer({ openDialog }) {
  const destination = (label) =>
    [
      "Find Opportunities",
      "Internships",
      "Full-time Jobs",
      "Part-time & Gig",
      "Application Tracker",
      "Careers",
    ].includes(label)
      ? "#opportunities"
      : label === "Explore Colleges"
        ? "#colleges"
        : label === "Contact Us"
          ? "#contact"
          : null;
  const footerLink = (label) =>
    destination(label) ? (
      <a href={destination(label)} key={label}>
        {label}
      </a>
    ) : (
      <button key={label} onClick={() => openDialog(label)}>
        {label}
        {label === "View all policies" && " →"}
      </button>
    );
  return (
    <footer className="footer">
      <div className="footer-glow">
        <Icon id="1-1726" />
        <Icon id="1-1734" />
      </div>
      <div className="container footer-inner">
        <div className="next-banner">
          <div>
            <h2>Ready for what’s next?</h2>
            <p>
              Discover colleges, find opportunities, list your
              <br className="desktop-break" /> institution, or start hiring with CampusPe.
            </p>
          </div>
          <div className="next-actions">
            <Button href="#colleges">
              Explore Colleges <Icon id="1-1752" />
            </Button>
            <Button href="#opportunities">
              Find Opportunities <Icon id="1-1752" />
            </Button>
            <Button
              variant="outline"
              onClick={() => openDialog("List Your College")}
            >
              List Your College <Icon id="1-1760" />
            </Button>
            <Button variant="outline" onClick={() => openDialog("Post a Job")}>
              Post a Job <Icon id="1-1760" />
            </Button>
          </div>
        </div>
        <div className="footer-columns">
          <div className="footer-brand">
            <a href="#top" aria-label="CampusPe home">
              <img
                src="/assets/campuspe-logo.svg"
                alt="CampusPe — Connecting Students, Institutions & Companies"
                width="186"
                height="55"
              />
            </a>
            <p>From choosing a college to finding your next opportunity.</p>
            <p>
              CampusPe connects students, colleges and employers in one place.
            </p>
          </div>
          {footerGroups.map((group) => (
            <div key={group.title} className="footer-column">
              <h3>{group.title}</h3>
              {group.links.map(footerLink)}
              {group.title === "Legal & Policies" && (
                <div className="policy-note">
                  Separate user,<br />institution and employer<br />terms can live inside the<br />full Policies page.
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="footer-contact">
          <div>
            <a href="mailto:contactus@campuspe.com">
              <span>
                <Icon id="1-1822" />
              </span>
              contactus@campuspe.com
            </a>
            <a href="tel:+916362606464">
              <span>
                <Icon id="1-1828" />
              </span>
              +91 6362606464
            </a>
          </div>
          <span className="audience-tag">
            <b className="online-dot" />
            Students · Colleges · Employers
          </span>
        </div>
        <div className="footer-bottom">
          <p>
            2026 CampusPe Technologies Pvt. Ltd.{" "}
            <button onClick={() => openDialog("Privacy Policy")}>
              Privacy
            </button>{" "}
            <button onClick={() => openDialog("Terms & Conditions")}>
              Terms
            </button>{" "}
            <button onClick={() => openDialog("Grievance Redressal")}>
              Grievance
            </button>
          </p>
          <div className="social-links">
            <button
              aria-label="CampusPe on LinkedIn"
              onClick={() => openDialog("CampusPe social channels")}
            >
              <Icon id="1-1840" />
            </button>
            <a
              href="https://www.instagram.com/campuspe_official/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="CampusPe on Instagram"
            >
              <Icon id="1-1843" />

            </a>
            <button
              aria-label="CampusPe on Twitter"
              onClick={() => openDialog("CampusPe social channels")}
            >
              <Icon id="1-1845" />
            </button>
            <button
              aria-label="CampusPe on Facebook"
              onClick={() => openDialog("CampusPe social channels")}
            >
              <Icon id="1-1847" />
            </button>
            <a
              href="https://wa.me/916362606464"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contact CampusPe on WhatsApp"
            >
              <Icon id="1-1852" />
            </a>
            <a
              href="https://youtube.com/@campuspe-tech"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="CampusPe on YouTube"
            >
              <Icon id="1-1855" />

            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

const formActions = new Set([
  "College waitlist",
  "Employer waitlist",
  "List Your College",
  "Post a Job",
  "WhatsApp alerts",
  "Sign Up",
  "Sign In",
]);

function ActionDialog({ title, close }) {
  const dialogRef = useRef(null);
  const [submitted, setSubmitted] = useState(false);
  useEffect(() => {
    const previous = document.activeElement;
    dialogRef.current?.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
      previous?.focus?.();
    };
  }, []);
  const item = opportunities.find((item) => item.title === title);
  const isForm = formActions.has(title);
  return (
    <dialog
      ref={dialogRef}
      className="action-dialog"
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
      aria-labelledby="dialog-title"
    >
      <div className="dialog-content">
        <button
          className="dialog-close"
          onClick={close}
          aria-label="Close dialog"
        >
          ×
        </button>
        <span className="dialog-kicker">CampusPe</span>
        <h2 id="dialog-title">{title}</h2>
        {submitted ? (
          <div className="dialog-success" role="status">
            <span>✓</span>
            <h3>Demo completed</h3>
            <p>
              Your form passed validation. This static demo does not send or
              store your details.
            </p>
            <Button onClick={close}>Done</Button>
          </div>
        ) : isForm ? (
          <>
            <p className="dialog-intro">
              Try the {title.toLowerCase()} form. This is a static frontend
              preview; no account or request will be created.
            </p>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                setSubmitted(true);
              }}
            >
              <label>
                {title === "Post a Job"
                  ? "Company name"
                  : title === "List Your College"
                    ? "College name"
                    : "Full name"}
                <input
                  name="name"
                  autoComplete="name"
                  required
                  minLength={2}
                  placeholder={
                    title === "Post a Job"
                      ? "Your company"
                      : title === "List Your College"
                        ? "Your institution"
                        : "Your name"
                  }
                />
              </label>
              <label>
                Email address
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                />
              </label>
              {title === "Post a Job" && (
                <label>
                  Role title
                  <input
                    name="role"
                    required
                    placeholder="e.g. Frontend Developer"
                  />
                </label>
              )}
              {title === "WhatsApp alerts" && (
                <label>
                  Phone number
                  <input
                    name="phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    pattern="[+0-9 ()-]{8,20}"
                    placeholder="+91"
                  />
                </label>
              )}
              <button type="submit" className="button button--primary">
                Try demo form →
              </button>
            </form>
          </>
        ) : item ? (
          <div className="opportunity-detail">
            <CompanyMark type={item.id} />
            <Chip tone={item.tone}>{item.badge}</Chip>
            <p>
              {item.location} · {item.detail} · {item.price}
            </p>
            <p>
              This is a sample opportunity shown in the Figma design. Live
              listings and applications are outside this static project.
            </p>
            <Button onClick={close}>Back to opportunities</Button>
          </div>
        ) : (
          <>
            <p className="dialog-intro">
              {title.includes("Policy") ||
              title.includes("Terms") ||
              title.includes("Disclaimer") ||
              title.includes("policies") ||
              title.includes("Grievance")
                ? "This assignment includes the landing page only. Official policy content has not been supplied. Contact CampusPe for the current policy."
                : title === "Get the CampusPe app"
                  ? "App store destinations have not been supplied for this static preview. Contact CampusPe for the official download links."
                  : title === "Blogs"
                    ? "The blog destination is not included in the supplied landing-page design. Explore CampusPe’s opportunities or contact the team to learn more."
                    : "This destination is outside the supplied static landing page. Contact CampusPe for more information."}
            </p>
            <Button href="mailto:contactus@campuspe.com">
              Contact CampusPe
            </Button>
          </>
        )}
      </div>
    </dialog>
  );
}

export default function CampusPe() {
  const [dialog, setDialog] = useState(null);
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header openDialog={setDialog} />
      <main id="main">
        <Hero openDialog={setDialog} />
        <Stats />
        <Partners />
        <OpportunitySection openDialog={setDialog} />
        <ResumeSection />
        <AudienceSection openDialog={setDialog} />
        <AudienceSection employer openDialog={setDialog} />
        <AppSection openDialog={setDialog} />
        <SupportSection />
      </main>
      <Footer openDialog={setDialog} />
      {dialog && (
        <ActionDialog
          key={dialog}
          title={dialog}
          close={() => setDialog(null)}
        />
      )}
    </>
  );
}
