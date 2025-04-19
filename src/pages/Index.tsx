
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";

const Index = () => {
  return (
    <div className="h-screen flex flex-col bg-gray-900">
      <Navbar 
        currentUser={null} 
        onLogout={() => {}}
      />
      <div className="flex-1 flex items-center justify-center">
        <Button>Go to Chat</Button>
      </div>
    </div>
  );
};

export default Index;
