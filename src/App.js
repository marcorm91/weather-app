
import WeatherHeader from "./components/weather-header/WeatherHeader";
import WeatherFooter from "./components/weather-footer/WeatherFooter";
import WeatherHome from "./pages/weather-home/WeatherHome";

function App() {
  return (
    <>
      <WeatherHeader></WeatherHeader>
      <WeatherHome></WeatherHome>
      <WeatherFooter></WeatherFooter>
    </>
  );
}

export default App;
