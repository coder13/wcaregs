import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Search from "./pages/Search";
import { Header } from "./components/Header";
import { RegulationsProvider } from "./providers/RegulationsProvider/RegulationsProvider";

function Layout() {
  return (
    <div id="app">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <RegulationsProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/search" element={<Search />} />
          </Route>
        </Routes>
      </RegulationsProvider>
    </BrowserRouter>
  );
}

export default App;
