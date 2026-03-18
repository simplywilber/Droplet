function About() {
  return (
    <div className="about-container">
      {/* Project Info Section */}
      <section className="about-header">
        <h1>About Droplet</h1>
        <p>
          Droplet is a dynamic, responsive web application designed to bring you
          real-time weather updates and daily inspiration. Built as a showcase
          of modern React development, it features external API integrations,
          user authentication via Firebase, and seamless client-side routing.
        </p>
      </section>

      {/* Motivation Section */}
      <section className="about-header" style={{ marginTop: "-20px" }}>
        <h2>The Idea</h2>
        <p>
          The idea for Droplet is an app that can be quickly checked to see if
          an umbrella or coat will be needed that day. We paired this with a
          daily quote to consider while starting the day, plus a longer forecast
          and saved quotes with personal notes.
        </p>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <h2>Meet the Team</h2>
        <div className="team-cards">
          {/* Wilber's Card */}
          <article className="team-card">
            <h3>Wilber</h3>
            <p className="role">Co-Developer</p>
            <p className="bio">
              Wilber is a veteran student and now developer who is pursiung his
              BAS in Software Engineering at Bellevue College. His main
              interests fall into full stack development but is eager to learn
              new languages/systems.
            </p>
            <a
              href="https://github.com/Simplywilber"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#9dc9e9",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              GitHub Profile
            </a>
          </article>

          {/* Christian's Card */}
          <article className="team-card">
            <h3>Christian V.</h3>
            <p className="role">Co-Developer</p>
            <p className="bio">
              Christian is a former Network Tech studying Software Development
              at Bellevue College who spends a little too much time at his desk.
              His main interests are Backend Development, though most things are
              interesting enough for him to fall down a rabbit hole learning
              about them.
            </p>
            <a
              href="https://github.com/ChristianVelezW"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#9dc9e9",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              GitHub Profile
            </a>
          </article>
        </div>
      </section>
    </div>
  );
}

export default About;
