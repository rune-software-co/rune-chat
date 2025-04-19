
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      <Navbar 
        currentUser={null} 
        onLogout={() => {}}
        onChangeTab={() => {}}
      />
      <div className="flex-1 flex items-center justify-center">
        <Button onClick={() => navigate("/")}>Go to Chat</Button>
      </div>
    </div>
  );
};

export default Index;
