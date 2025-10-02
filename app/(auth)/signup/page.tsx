import { SignupForm } from "@/components/forms/signup-form";

export default function SignupPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignupForm />
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background relative hidden lg:block">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative flex h-full flex-col items-center justify-center p-8 text-center">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Create Images at Scale
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Generate on-brand visuals for every channel and campaign
            </p>
          </div>

          {/* Mockup of the app interface */}
          <div className="relative w-80 h-60 bg-background rounded-lg shadow-2xl border">
            <div className="p-4 space-y-3">
              <div className="h-4 bg-primary/20 rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded"></div>
                <div className="h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded"></div>
              </div>
              <div className="flex space-x-2 mt-4">
                <div className="h-8 bg-primary/30 rounded w-16"></div>
                <div className="h-8 bg-muted rounded w-20"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
