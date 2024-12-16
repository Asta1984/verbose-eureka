import { Link } from 'react-router-dom'; // Use React Router's Link
import { Button } from "@/components/ui/button";
import { SearchBar } from '@/components/Searchbar';


export default function Hero() {
  return (
  <>
    <section className="py-20 px-6 text-center">
      <h1 className="text-4xl sm:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-pink-600 mt-10">
        Revolutionize Your Workflow
      </h1>
      <p className="text-xl mb-4 max-w-2xl mx-auto text-muted-foreground">
      Discover the power of tech with Sewantika. Transform your business through smart innovation.
      </p>
      <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
        <Button>
          <Link to="/#contact">Get Started</Link>
        </Button>
        <Button variant="outline">
          <Link to="/#features">Learn More</Link>
        </Button>
      </div>
    </section>
    <SearchBar />
  </>
  );
}
