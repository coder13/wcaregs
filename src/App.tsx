import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Search from "./pages/Search";
import { Header } from "./components/Header";
import { useContext } from "react";
import {
  RegulationsContext,
  RegulationsProvider,
} from "./providers/RegulationsProvider/RegulationsProvider";

function Layout() {
  const { version } = useContext(RegulationsContext);

  return (
    <div id="app">
      <Header version={version} />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

function App() {
  return (
    <RegulationsProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/search" element={<Search />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </RegulationsProvider>
  );
}

export default App;
