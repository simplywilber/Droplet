function Home() {
    // Dynamic greeting for UX
    const date = new Date();
    const hour = date.getHours();
    let greeting;

    if (hour >= 5 && hour < 12) {
        greeting = 'Good Morning,'
    } else if (hour >= 12 && hour < 18) {
        greeting = 'Good Afternoon,'
    } else {
        greeting = 'Good Evening,';
    }


  return (
    <div id="container-home">
      <div id="weather-container">
        <h1>{greeting}</h1>
      </div>
      <div id="weather-img">
        <img alt="Weather icon" />
      </div>
    </div>
  );
}
export default Home;
