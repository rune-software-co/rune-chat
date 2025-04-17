
import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type CaptchaProps = {
  onVerify: (verified: boolean) => void;
};

export const Captcha = ({ onVerify }: CaptchaProps) => {
  const [captchaText, setCaptchaText] = useState("");
  const [userInput, setUserInput] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  const generateCaptcha = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const length = 6;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setCaptchaText(result);
    setUserInput("");
    setIsVerified(false);
    onVerify(false);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleVerify = () => {
    const verified = userInput === captchaText;
    setIsVerified(verified);
    onVerify(verified);
  };

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <Label htmlFor="captcha" className="text-gray-300">Captcha Verification</Label>
        <div className="flex items-center gap-2">
          <div className="font-mono text-lg bg-gray-700 px-4 py-2 rounded-md tracking-wider text-purple-300 font-bold select-none">
            {captchaText}
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={generateCaptcha}
            className="text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <RefreshCw size={18} />
          </Button>
        </div>
      </div>
      <div className="space-y-1">
        <Input
          id="captcha"
          type="text"
          placeholder="Enter the captcha text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="bg-gray-800 border-gray-700 text-gray-200"
        />
      </div>
      <Button 
        onClick={handleVerify}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
        disabled={isVerified}
      >
        {isVerified ? "Verified" : "Verify"}
      </Button>
      {isVerified && (
        <p className="text-sm text-green-400 text-center">Captcha verified successfully!</p>
      )}
    </div>
  );
};
