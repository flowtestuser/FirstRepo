import { AdditionCalculator } from "@/components/addition-calculator";

export default function Home() {
  return (
    <main className="page-shell">
      <header className="page-heading">
        <p className="eyebrow">A little arithmetic</p>
        <h1>Addition, plainly.</h1>
        <p className="intro">Two numbers in. One clear answer out.</p>
      </header>
      <AdditionCalculator />
      <footer className="page-footer">
        A quiet place to work out the numbers.
      </footer>
    </main>
  );
}
